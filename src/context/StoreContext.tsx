"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  loginAsStudent: (email: string, name?: string) => StudentUser;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const COURSES_STORAGE_KEY = "concurso_courses_v2";
const ORDERS_STORAGE_KEY = "concurso_orders_v2";
const SETTINGS_STORAGE_KEY = "concurso_settings_v2";
const USER_STORAGE_KEY = "concurso_current_user_v2";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState<Course | null>(null);
  const [activeSegmentFilter, setActiveSegmentFilter] = useState<SegmentType | "todos">("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      }

      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }

      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        const adminEmails = Array.from(new Set(["reicomboadm@gmail.com", ...(parsed.adminEmails || [])]));
        setSettings({ ...initialSiteSettings, ...parsed, adminEmails });
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
  }): Promise<Order> => {
    const course = courses.find((c) => c.id === data.courseId);
    if (!course) throw new Error("Curso não encontrado.");

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

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
        if (json.pixCopyPaste) pixCopyPaste = json.pixCopyPaste;
        if (json.qrCode) qrCodeUrl = json.qrCode;
        if (json.transactionId) transactionId = json.transactionId;
      }
    } catch (apiErr) {
      console.warn("Could not reach /api/checkout, using fallback generator", apiErr);
    }

    if (!pixCopyPaste) {
      const pixPayloadFallback = generatePixPayload({
        pixKey: settings.pixKey,
        beneficiaryName: settings.beneficiaryName,
        beneficiaryCity: settings.beneficiaryCity,
        amount: course.price,
        txid: orderId.replace("-", ""),
        description: course.title.slice(0, 25),
      });
      pixCopyPaste = pixPayloadFallback;
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
        updateSettings,
        loginAsStudent,
        logout,
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
