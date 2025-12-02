/**
 * Zembil Marketplace - MongoDB Models Index
 * 
 * Centralized export for all database models
 * Total Collections: 22 (Core + New)
 */

// ===== CORE COLLECTIONS (6) =====
export { User } from "./users";
export { Buyer } from "./buyer";
export { Seller } from "./seller";
export { Product } from "./product";
export { Category } from "./category";
export { Address } from "./address";

// ===== TRANSACTION COLLECTIONS (6) =====
export { Order } from "./order";
export { Payment } from "./payment";
export { SellerEarnings } from "./sellerEarnings";
export { PayoutRequest } from "./payoutRequest";
export { Cart } from "./cart";
export { Wishlist } from "./wishlist";

// ===== CONTENT & COMMUNICATION (5) =====
export { Review } from "./review";
export { Chat } from "./chat";
export { Message } from "./message";
export { Notification } from "./notification";
export { Banner } from "./banner";

// ===== SUPPORT & FEATURES (2) =====
export { FeatureRequest } from "./featureRequest";
export { SupportTicket } from "./supportTicket";

// ===== DISPUTE & RETURNS (2) =====
export { Dispute } from "./dispute";
export { Refund } from "./refund";

// ===== ADMIN & SYSTEM (7) =====
export { AuditLog } from "./auditLog";
export { SystemConfig } from "./systemConfig";
export { SystemHealth } from "./systemHealth";
export { BulkOperation } from "./bulkOperation";
export { ReportConfig } from "./reportConfig";
export { PlatformEvent } from "./platformEvent";
export { UserSession } from "./userSession";

// ===== SUPPORTING (2) =====
export { Promotion } from "./promotion";
export { ProductDraft } from "./productDraft";

/**
 * Model Categories:
 * 
 * Core (6): users, buyers, sellers, products, categories, addresses
 * Transactions (6): orders, payments, sellerEarnings, payoutRequests, cart, wishlist
 * Communication (5): reviews, chat, message, notification, banner
 * Support (2): featureRequests, supportTickets
 * Disputes (2): disputes, refunds
 * Admin (7): auditLog, systemConfig, systemHealth, bulkOperations, reportConfig, platformEvent, userSession
 * Supporting (2): promotions, productDrafts
 * 
 * Total: 30 Collections
 */

