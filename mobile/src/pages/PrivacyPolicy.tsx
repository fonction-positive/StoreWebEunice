import { ChevronRight, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. 信息收集",
      content: "我们收集您在使用服务时提供的信息，包括但不限于：注册信息（用户名、邮箱、手机号）、订单信息（收货地址、支付信息）、浏览记录和设备信息。这些信息用于为您提供更好的服务体验。",
    },
    {
      title: "2. 信息使用",
      content: "我们使用收集的信息来：处理您的订单和交易、提供客户服务、改进我们的产品和服务、发送订单状态更新和促销信息（您可以随时取消订阅）、防止欺诈和滥用行为。",
    },
    {
      title: "3. 信息共享",
      content: "我们不会出售、出租或交易您的个人信息。我们可能会与以下第三方共享必要的信息：物流服务提供商（用于配送）、支付服务提供商（用于处理交易）、云服务提供商（用于数据存储）。这些第三方均签署了保密协议，严格遵守数据保护法规。",
    },
    {
      title: "4. 信息安全",
      content: "我们采用行业标准的安全措施保护您的信息，包括：数据加密传输（SSL/TLS）、安全的数据存储、定期安全审计、访问控制和权限管理。尽管我们尽最大努力保护您的信息，但互联网传输不能保证100%安全。",
    },
    {
      title: "5. Cookie使用",
      content: "我们使用Cookie和类似技术来：记住您的偏好设置、分析网站使用情况、提供个性化内容和广告。您可以通过浏览器设置管理Cookie，但这可能影响某些功能的正常使用。",
    },
    {
      title: "6. 您的权利",
      content: "您有权：访问和更新您的个人信息、删除您的账户和数据、选择退出营销通讯、要求我们停止处理您的信息。如需行使这些权利，请通过客服联系我们。",
    },
    {
      title: "7. 未成年人保护",
      content: "我们的服务面向18岁及以上的用户。如果我们发现收集了未成年人的信息，将立即删除相关数据。",
    },
    {
      title: "8. 政策更新",
      content: "我们可能会不时更新本隐私政策。重大变更时，我们会通过网站公告或邮件通知您。继续使用我们的服务即表示您接受更新后的政策。",
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
          <h1 className="text-3xl font-bold">隐私政策</h1>
        </div>

        {/* Introduction */}
        <Card className="p-6 rounded-2xl mb-6 bg-primary text-primary-foreground">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-lg mb-2">保护您的隐私</p>
              <p className="text-sm opacity-90">
                我们非常重视您的隐私保护。本政策说明我们如何收集、使用和保护您的个人信息。
              </p>
            </div>
          </div>
        </Card>

        {/* Last Updated */}
        <p className="text-sm text-muted-foreground mb-6 px-2">
          最后更新：2024年1月1日
        </p>

        {/* Policy Content */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <Card key={index} className="p-6 rounded-2xl">
              <h2 className="font-bold text-lg mb-3">{section.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </Card>
          ))}
        </div>

        {/* Contact */}
        <Card className="p-6 rounded-2xl mt-6 bg-muted/50">
          <h3 className="font-bold mb-2">联系我们</h3>
          <p className="text-sm text-muted-foreground">
            如对本隐私政策有任何疑问，请通过以下方式联系我们：
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            邮箱：privacy@fluxwear.com
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
