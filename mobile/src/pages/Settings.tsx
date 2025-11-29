import { ChevronRight, MapPin, Bell, Lock, Globe, HelpCircle, FileText, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Link, useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: "账户设置",
      items: [
        { icon: MapPin, label: "地址管理", description: "管理您的收货地址", path: "/address-management" },
        { icon: Lock, label: "密码与安全", description: "修改密码和安全设置", path: "/password-security" },
        { icon: Bell, label: "通知设置", description: "管理推送通知偏好", path: "/notification-settings" },
      ],
    },
    {
      title: "偏好设置",
      items: [
        { icon: Globe, label: "语言", description: "简体中文", path: "/language-settings" },
      ],
    },
    {
      title: "帮助与支持",
      items: [
        { icon: HelpCircle, label: "帮助中心", description: "常见问题解答", path: "/help-center" },
        { icon: FileText, label: "隐私政策", description: "了解我们如何保护您的数据", path: "/privacy-policy" },
        { icon: Info, label: "关于我们", description: "版本 1.0.0", path: "/about" },
      ],
    },
  ];

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
          <h1 className="text-3xl font-bold">设置</h1>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                {section.title}
              </h2>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <Card className="p-4 rounded-2xl cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{item.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </Card>
                  );

                  return item.path ? (
                    <Link key={item.label} to={item.path}>
                      {content}
                    </Link>
                  ) : (
                    <div key={item.label}>{content}</div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
