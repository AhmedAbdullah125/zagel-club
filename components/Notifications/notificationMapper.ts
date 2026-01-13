export const NotificationTypeEnum = Object.freeze({
    ADMIN: "admin",
    PHONE: "phone",
    BLOCK: "block",
    DELETE: "delete",
    SUPPORT: "support",
    PROFILE: "profile",
    COMPLAINT: "complaint",
    BALANCE: "balance",
    SERVICE_REQUEST: "serviceRequest",
    AUCTION: "auction",
});

export type IncomingNotification = {
    id: string | number;
    type: string;
    title?: string;
    message?: string;
    timeAdd?: string;

    // backend sometimes sends nested data
    data?: { id?: string | number };

    // optional flat ref
    refId?: string | number;
};

export function getRefId(n: IncomingNotification) {
    return n.refId ?? n.data?.id;
}

export function mapNotificationToUI(n: IncomingNotification) {
    const refId = getRefId(n);

    switch (n.type) {
        case NotificationTypeEnum.AUCTION:
            // ✅ your page is /auctions, not /auction
            return {
                label: "Auction update",
                route: refId ? `/auctions/${refId}` : "/auctions",
                tone: "info" as const,
            };

        case NotificationTypeEnum.SERVICE_REQUEST:
            return {
                label: "Service request",
                route: refId ? `/order/${refId}` : "/services",
                tone: "info" as const,
            };

        case NotificationTypeEnum.COMPLAINT:
            return {
                label: "Complaint update",
                route: refId ? `/complaints/${refId}` : "/complaints",
                tone: "info" as const,
            };

        case NotificationTypeEnum.BALANCE:
            return { label: "Wallet / balance", route: "/wallet", tone: "success" as const };

        case NotificationTypeEnum.PROFILE:
            return { label: "Profile update", route: "/profile", tone: "info" as const };

        case NotificationTypeEnum.SUPPORT:
            return { label: "Support", route: "/contact", tone: "info" as const };

        case NotificationTypeEnum.PHONE:
            return { label: "Phone", route: "/settings", tone: "warning" as const };

        case NotificationTypeEnum.BLOCK:
            return { label: "Account blocked", route: "/", tone: "error" as const };

        case NotificationTypeEnum.DELETE:
            return { label: "Account deleted", route: "/", tone: "error" as const };

        case NotificationTypeEnum.ADMIN:
        default:
            return { label: "New notification", route: "/notifications", tone: "info" as const };
    }
}
