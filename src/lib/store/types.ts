/**
 * Tipos de la "base de datos" de la tienda (pedidos, stock y ajustes).
 * Todo vive en un solo documento JSON: la tienda es pequeña y así se puede
 * guardar en un archivo (local) o en Vercel Blob (producción) sin montar un motor.
 */

export type OrderStatus =
  /** El cliente tiene 15 minutos para pagar y mandar su código */
  | "pendiente_pago"
  /** Mandó el código de Yape/Plin; falta que el dueño lo confirme */
  | "en_validacion"
  /** Pago confirmado */
  | "pagado"
  /** Ya salió el envío */
  | "enviado"
  /** Se acabó el tiempo sin código */
  | "expirado"
  /** Cancelado a mano desde el panel */
  | "cancelado";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pendiente_pago: "Esperando WhatsApp",
  en_validacion: "Por validar",
  pagado: "Pagado / vendido",
  enviado: "Enviado",
  expirado: "Expirado",
  cancelado: "Cancelado",
};

export type ShippingMethod = "shalom" | "indriver";

export const SHIPPING_LABEL: Record<ShippingMethod, string> = {
  shalom: "Shalom (agencia)",
  indriver: "InDriver (en el momento)",
};

/** Desde dónde salió el pago hacia la billetera Dale. */
export type PaymentMethod = "yape" | "plin" | "dale" | "otro";

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  yape: "Yape",
  plin: "Plin",
  dale: "Dale",
  otro: "Banco / otra billetera",
};

export type OrderItem = {
  slug: string;
  name: string;
  colorName: string;
  size: number;
  qty: number;
  price: number;
};

export type OrderCustomer = {
  name: string;
  phone: string;
  dni: string;
};

export type OrderShipping = {
  method: ShippingMethod;
  /** Shalom: ciudad/agencia de destino. InDriver: distrito. */
  city: string;
  /** Shalom: agencia. InDriver: dirección exacta. */
  address: string;
  notes: string;
};

export type OrderPayment = {
  method: PaymentMethod;
  /** Código de operación que escribe el cliente */
  code: string;
  submittedAt: string;
};

export type OrderEvent = {
  at: string;
  status: OrderStatus;
  note?: string;
};

export type Order = {
  id: string;
  /** Código corto que ve el cliente, ej. ISK-4KQ9 */
  ref: string;
  status: OrderStatus;
  createdAt: string;
  /** Fin de la ventana de 15 minutos para pagar */
  expiresAt: string;
  items: OrderItem[];
  total: number;
  customer: OrderCustomer | null;
  shipping: OrderShipping | null;
  payment: OrderPayment | null;
  /** Código de seguimiento de Shalom o referencia del InDriver */
  tracking: string;
  history: OrderEvent[];
};

export type StoreSettings = {
  /**
   * Minutos que las tallas quedan reservadas desde que el cliente manda el
   * pedido por WhatsApp. Si no se confirma, vuelven al stock solas.
   */
  windowMinutes: number;
  /** Precio único */
  price: number;
  shalom: boolean;
  indriver: boolean;
  /** Si está en false, la tienda solo vende por WhatsApp (sin ventana de pago) */
  checkoutEnabled: boolean;
};

/** Stock por talla. `null` = sin control de stock (se puede vender). */
export type SizeStock = Record<string, number | null>;

/** Una venta concretada: lo que entra a caja y sale del stock. */
export type Sale = {
  id: string;
  /** Fecha en que se concretó */
  at: string;
  slug: string;
  colorName: string;
  size: number;
  qty: number;
  /** Precio por par */
  unit: number;
  total: number;
  /** De dónde salió: pedido de la web, venta cargada a mano o histórico */
  source: "web" | "manual" | "historico";
  /** Código del pedido, si vino de la web */
  orderRef?: string;
  note?: string;
};

export type StoreData = {
  version: number;
  /** Versión del stock cargado desde el código */
  stockVersion?: number;
  settings: StoreSettings;
  /** slug del producto -> stock por talla */
  inventory: Record<string, SizeStock>;
  orders: Order[];
  /** Caja: todas las ventas concretadas */
  sales?: Sale[];
  /** Versión del histórico de ventas cargado desde el código */
  salesVersion?: number;
};
