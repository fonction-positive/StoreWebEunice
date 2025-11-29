import { useState } from "react";
import { ChevronRight, Bell, Package, Megaphone, Info, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "order" | "promotion" | "system";
  title: string;
  content: string;
  time: string;
  isRead: boolean;
}

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order",
      title: "订单已发货",
      content: "您的订单 #202401150001 已发货，预计3天内送达",
      time: "2分钟前",
      isRead: false,
    },
    {
      id: "2",
      type: "promotion",
      title: "新品上架",
      content: "春季新款手机链已上架，首发8折优惠",
      time: "1小时前",
      isRead: false,
    },
    {
      id: "3",
      type: "order",
      title: "订单已完成",
      content: "订单 #202401140001 已完成，感谢您的购买",
      time: "昨天",
      isRead: true,
    },
    {
      id: "4",
      type: "system",
      title: "系统维护通知",
      content: "系统将于本周六凌晨2:00-4:00进行维护",
      time: "2天前",
      isRead: true,
    },
    {
      id: "5",
      type: "promotion",
      title: "限时优惠",
      content: "全场满99减10，满199减30，快来选购吧",
      time: "3天前",
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return Package;
      case "promotion":
        return Megaphone;
      case "system":
        return Info;
    }
  };

  const getTypeLabel = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return "订单";
      case "promotion":
        return "活动";
      case "system":
        return "系统";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast({
      title: "已全部标记为已读",
    });
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </Button>
            <h1 className="text-3xl font-bold">通知</h1>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-sm"
            >
              <Check className="h-4 w-4 mr-1" />
              全部已读
            </Button>
          )}
        </div>

        {/* Unread Count */}
        {unreadCount > 0 && (
          <Card className="p-5 rounded-2xl mb-6 bg-primary text-primary-foreground">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bell className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm opacity-90 mb-1">未读通知</p>
                <p className="text-3xl font-bold">{unreadCount} 条</p>
              </div>
            </div>
          </Card>
        )}

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card className="p-12 rounded-2xl text-center">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">暂无通知</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = getTypeIcon(notification.type);
              
              return (
                <Card 
                  key={notification.id} 
                  className="p-5 rounded-2xl cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>
                      {!notification.isRead && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full border-2 border-card" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-sm">{notification.title}</h3>
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          {getTypeLabel(notification.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {notification.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
