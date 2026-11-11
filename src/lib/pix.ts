/**
 * Utility to generate standard Brazilian EMV PIX Copia e Cola payload
 * and calculate CRC16 (CCITT-FALSE).
 */

function crc16(buffer: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer.charCodeAt(i);
    for (let bit = 0; bit < 8; bit++) {
      const bitSet = ((byte >> (7 - bit)) & 1) === 1;
      const c15 = ((crc >> 15) & 1) === 1;
      crc <<= 1;
      if (c15 !== bitSet) {
        crc ^= polynomial;
      }
    }
  }

  crc &= 0xffff;
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function emvFormat(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

export interface PixOptions {
  pixKey: string;
  beneficiaryName: string;
  beneficiaryCity: string;
  amount: number;
  txid?: string;
  description?: string;
}

export function generatePixPayload(options: PixOptions): string {
  const {
    pixKey,
    beneficiaryName = "PORTAL CURSOS",
    beneficiaryCity = "BRASILIA",
    amount,
    txid = "***",
    description = "Curso Concursos",
  } = options;

  // Clean values
  const cleanKey = pixKey.trim();
  const cleanName = beneficiaryName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().slice(0, 25);
  const cleanCity = beneficiaryCity.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().slice(0, 15);
  const cleanTxid = (txid || "***").replace(/[^a-zA-Z0-9]/g, "").slice(0, 25) || "***";
  const formattedAmount = amount > 0 ? amount.toFixed(2) : "0.00";

  // Account Info (26)
  const gui = emvFormat("00", "br.gov.bcb.pix");
  const keyTag = emvFormat("01", cleanKey);
  const descTag = description ? emvFormat("02", description.slice(0, 30)) : "";
  const merchantAccountInfo = emvFormat("26", `${gui}${keyTag}${descTag}`);

  // Merchant Category Code (52)
  const mcc = emvFormat("52", "0000");

  // Transaction Currency (53) - 986 is BRL
  const currency = emvFormat("53", "986");

  // Transaction Amount (54)
  const amountTag = emvFormat("54", formattedAmount);

  // Country Code (58)
  const country = emvFormat("58", "BR");

  // Merchant Name (59)
  const nameTag = emvFormat("59", cleanName || "CURSOS CONCURSOS");

  // Merchant City (60)
  const cityTag = emvFormat("60", cleanCity || "BRASILIA");

  // Additional Data Field Template (62) -> txid (05)
  const txidTag = emvFormat("05", cleanTxid);
  const additionalData = emvFormat("62", txidTag);

  // Payload Format Indicator (00)
  const formatIndicator = emvFormat("00", "01");

  // Combine before CRC
  const rawPayload = `${formatIndicator}${merchantAccountInfo}${mcc}${currency}${amountTag}${country}${nameTag}${cityTag}${additionalData}6304`;

  // Compute CRC16
  const checksum = crc16(rawPayload);

  return `${rawPayload}${checksum}`;
}
