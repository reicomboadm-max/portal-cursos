"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import QRCode from "qrcode";
import { Course, Order, OrderStatus, SiteSettings, StudentUser, SegmentType } from "@/types";
import { initialCourses, initialOrders, initialSiteSettings } from "@/data/courses";
import { generatePixPayload } from "@/lib/pix";

interface StoreContextType {
  courses: Course[];
  orders: Order[];
  settings: SiteSettings;
  currentUser: StudentUser | null;
  selectedCourseForCheckout: Course | null;
  activeSegmentFilter: SegmentType | "todos";
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setActiveSegmentFilter: (seg: SegmentType | "todos") => void;
  openCheckout: (course: Course) => void;
  closeCheckout: () => void;
  createOrder: (data: {
    courseId: string;
    studentName: string;
    studentEmail: string;
    studentWhatsapp?: string;
    studentCpf?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  clearTestOrders: () => void;
  getUniqueStudents: () => Array<{
    name: string;
    email: string;
    whatsapp?: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderId: string;
    lastOrderStatus: OrderStatus;
  }>;
  deleteStudent: (studentEmail: string) => void;
  simulatePaymentApproval: (orderId: string) => void;
  markOrderDelivered: (orderId: string) => void;
  updateOrderStudentEmail: (orderId: string, newEmail: string) => void;
  addCourse: (course: Omit<Course, "id">) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  resetCatalogToDefault: () => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  loginAsStudent: (email: string, name?: string) => StudentUser;
  logout: () => void;
  // Admin & Real-time
  isAdmin: boolean;
  refreshOrdersFromServer: () => Promise<void>;
  lastOrderUpdate: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const COURSES_STORAGE_KEY = "concurso_courses_v7";
const ORDERS_STORAGE_KEY = "concurso_orders_v2";
const SETTINGS_STORAGE_KEY = "concurso_settings_v2";
const USER_STORAGE_KEY = "concurso_current_user_v2";

function sanitizeText(str: string): string {
  if (!str) return str;
  return str
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\([áàãâéêíóôõúüçÁÀÃÂÉÊÍÓÔÕÚÜÇ])/g, '$1');
}

function sanitizeCourse(c: Course): Course {
  return {
    ...c,
    title: sanitizeText(c.title),
    description: sanitizeText(c.description),
    shortDescription: sanitizeText(c.shortDescription),
    platform: sanitizeText(c.platform),
    folderSize: sanitizeText(c.folderSize),
    totalFiles: sanitizeText(c.totalFiles),
    features: Array.isArray(c.features) ? c.features.map(sanitizeText) : c.features
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState<Course | null>(null);
  const [activeSegmentFilter, setActiveSegmentFilter] = useState<SegmentType | "todos">("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastOrderUpdate, setLastOrderUpdate] = useState<number>(Date.now());
  const eventSourceRef = useRef<EventSource | null>(null);

  // Admin detection
  const isAdmin = currentUser?.role === "admin" || 
    (currentUser && (
      settings.adminEmails.some(e => e.toLowerCase() === currentUser.email.toLowerCase()) ||
      currentUser.email.toLowerCase() === "reicomboadm@gmail.com" ||
      currentUser.email.toLowerCase() === "gptdoscriasstpg@gmail.com"
    ));

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      // Clean up legacy caches
      localStorage.removeItem("concurso_courses");
      localStorage.removeItem("concurso_courses_v2");
      localStorage.removeItem("concurso_courses_v3");
      localStorage.removeItem("concurso_courses_v4");
      localStorage.removeItem("concurso_courses_v5");
      localStorage.removeItem("concurso_courses_v6");

      const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
      if (storedCourses) {
        const parsed = JSON.parse(storedCourses);
        // Ensure no leftover combos in stored list and all characters are decoded
        const cleanList = Array.isArray(parsed) 
          ? parsed
              .filter((c: Course) => c.segment !== ("combos" as any) && !c.title.toLowerCase().startsWith("combo"))
              .map(sanitizeCourse)
          : [];

        if (cleanList.length >= initialCourses.length) {
          setCourses(cleanList);
        } else {
          setCourses(initialCourses);
          localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(initialCourses));
        }
      } else {
        setCourses(initialCourses);
        localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(initialCourses));
      }

      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }

      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        const adminEmails = Array.from(new Set(["reicomboadm@gmail.com", "gptdoscriasstpg@gmail.com", ...(parsed.adminEmails || [])]));
        const telegramSupport = (!parsed.telegramSupport || parsed.telegramSupport.includes("driveconcursos_suporte"))
          ? "https://t.me/Baldodrive"
          : parsed.telegramSupport;
        const telegramChannel = parsed.telegramChannel || "https://t.me/comboreiboss";
        setSettings({ ...initialSiteSettings, ...parsed, adminEmails, telegramSupport, telegramChannel });
      }

      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to load local state", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
    } catch (e) {
      console.error(e);
    }
  }, [courses, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser, isHydrated]);

  // Real-time SSE connection for order updates (admin only)
  useEffect(() => {
    if (!isAdmin || typeof window === "undefined") return;

    const es = new EventSource("/api/orders/stream");
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "ORDER_UPDATE" && data.order) {
          setOrders((prev) => {
            const exists = prev.find(o => o.id === data.order.id);
            if (exists) {
              return prev.map(o => o.id === data.order.id ? data.order : o);
            } else {
              return [data.order, ...prev];
            }
          });
          setLastOrderUpdate(Date.now());
        } else if (data.type === "ORDERS_SYNC" && Array.isArray(data.orders)) {
          setOrders(data.orders);
          setLastOrderUpdate(Date.now());
        }
      } catch (e) {
        console.error("SSE parse error:", e);
      }
    };

    es.onerror = () => {
      console.warn("SSE connection lost, will retry...");
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [isAdmin]);

  // Refresh orders from server (for admin dashboard polling fallback)
  const refreshOrdersFromServer = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (res.ok) {
        const serverOrders = await res.json();
        setOrders(serverOrders);
        setLastOrderUpdate(Date.now());
      }
    } catch (e) {
      console.error("Failed to refresh orders:", e);
    }
  }, []);

  const openCheckout = (course: Course) => {
    setSelectedCourseForCheckout(course);
  };

  const closeCheckout = () => {
    setSelectedCourseForCheckout(null);
  };

  const createOrder = async (data: {
    courseId: string;
    studentName: string;
    studentEmail: string;
    studentWhatsapp?: string;
    studentCpf?: string;
  }): Promise<Order> => {
    const course = courses.find((c) => c.id === data.courseId) || selectedCourseForCheckout;
    if (!course) throw new Error("Curso não encontrado.");

    let orderId = "";
    let pixCopyPaste = "";
    let qrCodeUrl = "";
    let transactionId = "";

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          nome: data.studentName.trim(),
          email: data.studentEmail.trim().toLowerCase(),
          whatsapp: data.studentWhatsapp?.trim() || "",
          cpf: data.studentCpf?.trim() || "",
          courseTitle: course.title,
          coursePrice: course.price,
          courseDriveUrl: course.driveUrl,
          courseSegment: course.segment,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.orderId) orderId = json.orderId;
        if (json.pixCopyPaste) pixCopyPaste = json.pixCopyPaste;
        if (json.qrCode) qrCodeUrl = json.qrCode;
        if (json.transactionId) transactionId = json.transactionId;
      } else {
        const jsonErr = await res.json();
        throw new Error(jsonErr.error || "Erro ao gerar PIX oficial na VeloraPay");
      }
    } catch (apiErr: any) {
      console.error("Erro na chamada de checkout:", apiErr);
      throw apiErr;
    }

    if (!orderId || !pixCopyPaste) {
      throw new Error("Erro ao obter código PIX da operadora.");
    }

    if (!qrCodeUrl && pixCopyPaste) {
      try {
        qrCodeUrl = await QRCode.toDataURL(pixCopyPaste, {
          margin: 2,
          width: 320,
          color: {
            dark: "#0b0f19",
            light: "#ffffff",
          },
        });
      } catch (err) {
        console.error("QR Code generation error:", err);
      }
    }

    // 24 hours from now
    const deliveryMax = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const newOrder: Order = {
      id: orderId,
      studentName: data.studentName.trim(),
      studentEmail: data.studentEmail.trim().toLowerCase(),
      studentWhatsapp: data.studentWhatsapp?.trim(),
      studentCpf: data.studentCpf?.trim(),
      courseId: course.id,
      courseTitle: course.title,
      courseSegment: course.segment,
      amount: course.price,
      paymentMethod: "PIX",
      status: "PENDING",
      pixCopyPaste: pixCopyPaste,
      pixQrCodeUrl: qrCodeUrl,
      driveUrl: course.driveUrl,
      createdAt: new Date().toISOString(),
      deliveryEstimatedMax: deliveryMax,
      veloraTransactionId: transactionId,
    };

    setOrders((prev) => [newOrder, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const now = new Date().toISOString();
          const updated: Order = {
            ...o,
            status,
            paidAt: status === "PAID" || status === "DELIVERED" ? (o.paidAt || now) : o.paidAt,
            deliveredAt: status === "DELIVERED" ? now : o.deliveredAt,
          };

          // If DELIVERED, grant to currentUser if matching email
          if (status === "DELIVERED" && currentUser && currentUser.email.toLowerCase() === o.studentEmail.toLowerCase()) {
            if (!currentUser.purchasedCourseIds.includes(o.courseId)) {
              setCurrentUser({
                ...currentUser,
                purchasedCourseIds: [...currentUser.purchasedCourseIds, o.courseId],
              });
            }
          }

          return updated;
        }
        return o;
      })
    );
  };

  const simulatePaymentApproval = (orderId: string) => {
    // When PIX is confirmed, order moves to PAID (preparing to deliver within 24h)
    updateOrderStatus(orderId, "PAID");
  };

  const markOrderDelivered = (orderId: string) => {
    // Admin marks as sent to student's Gmail
    updateOrderStatus(orderId, "DELIVERED");
  };

  const updateOrderStudentEmail = (orderId: string, newEmail: string) => {
    const clean = newEmail.trim().toLowerCase();
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, studentEmail: clean } : o))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Unique students extracted from orders (for client management)
  const getUniqueStudents = () => {
    const seen = new Set<string>();
    const students: Array<{
      name: string;
      email: string;
      whatsapp?: string;
      totalOrders: number;
      totalSpent: number;
      lastOrderId: string;
      lastOrderStatus: OrderStatus;
    }> = [];
    const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    for (const o of sorted) {
      const key = o.studentEmail.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const userOrders = orders.filter((x) => x.studentEmail.toLowerCase() === key);
      students.push({
        name: o.studentName,
        email: o.studentEmail,
        whatsapp: o.studentWhatsapp,
        totalOrders: userOrders.length,
        totalSpent: userOrders.reduce((acc, x) => acc + x.amount, 0),
        lastOrderId: o.id,
        lastOrderStatus: o.status,
      });
    }
    return students;
  };

  const deleteStudent = (studentEmail: string) => {
    const clean = studentEmail.trim().toLowerCase();
    setOrders((prev) => prev.filter((o) => o.studentEmail.toLowerCase() !== clean));
    if (currentUser && currentUser.email.toLowerCase() === clean) {
      setCurrentUser(null);
    }
  };

  const clearTestOrders = () => {
    setOrders((prev) => prev.filter((o) => o.status === "PAID" || o.status === "DELIVERED"));
  };

  const addCourse = (courseData: Omit<Course, "id">) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
    };
    setCourses((prev) => [newCourse, ...prev]);
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const resetCatalogToDefault = () => {
    setCourses(initialCourses);
    try {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(initialCourses));
    } catch (e) {
      console.error(e);
    }
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const loginAsStudent = (email: string, name?: string): StudentUser => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = settings.adminEmails.some((adminEmail) => adminEmail.toLowerCase() === cleanEmail);

    // Find all delivered or paid orders for this student
    const activeCourseIds = orders
      .filter((o) => o.studentEmail.toLowerCase() === cleanEmail && (o.status === "DELIVERED" || o.status === "PAID"))
      .map((o) => o.courseId);

    const user: StudentUser = {
      id: `usr-${Date.now()}`,
      name: name || cleanEmail.split("@")[0].toUpperCase(),
      email: cleanEmail,
      role: isAdmin ? "admin" : "student",
      purchasedCourseIds: Array.from(new Set(activeCourseIds)),
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <StoreContext.Provider
      value={{
        courses,
        orders,
        settings,
        currentUser,
        selectedCourseForCheckout,
        activeSegmentFilter,
        searchQuery,
        setSearchQuery,
        setActiveSegmentFilter,
        openCheckout,
        closeCheckout,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        clearTestOrders,
        getUniqueStudents,
        deleteStudent,
        simulatePaymentApproval,
        markOrderDelivered,
        updateOrderStudentEmail,
        addCourse,
        updateCourse,
        deleteCourse,
        resetCatalogToDefault,
        updateSettings,
        loginAsStudent,
        logout,
        isAdmin,
        refreshOrdersFromServer,
        lastOrderUpdate,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
