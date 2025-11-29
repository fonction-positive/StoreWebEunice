import { useState } from "react";
import { ChevronRight, Bell, Package, Heart, MessageSquare, Megaphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";

interface NotificationSetting {
  id: string;
  icon: any;
  label: string;
  description: string;
  enabled: boolean;
}

const NotificationSettings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "orders",
      icon: Package,
      label: "订单通知",
      description: "订单状态变更时通知我",
      enabled: true,
    },
    {
      id: "promotions",
      icon: Megaphone,
      label: "促销活动",
      description: "新品上架和优惠活动通知",
      enabled: true,
    },
    {
      id: "favorites",
      icon: Heart,
      label: "收藏提醒",
      description: "收藏商品降价时通知我",
      enabled: false,
    },
    {
      id: "messages",
      icon: MessageSquare,
      label: "消息通知",
      description: "客服回复和系统消息",
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const enabledCount = settings.filter(s => s.enabled).length;

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Button>
          <h1 className="text-3xl font-bold">通知设置</h1>
        </div>

        {/* Summary Card */}
        <Card className="p-6 rounded-2xl mb-6 bg-primary text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bell className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">已启用通知</p>
              <p className="text-3xl font-bold">{enabledCount}/{settings.length}</p>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <div className="space-y-3">
          {settings.map((setting) => {
            const Icon = setting.icon;
            
            return (
              <Card key={setting.id} className="p-5 rounded-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{setting.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => toggleSetting(setting.id)}
                  />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Info */}
        <Card className="p-6 rounded-2xl mt-6 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            关闭通知后，您将不会收到相关的推送消息。订单状态变更通知建议保持开启，以便及时了解订单动态。
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default NotificationSettings;
