import { ChevronRight, Sparkles, Heart, Users, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "精选设计",
      description: "每一款手机链都经过精心设计，融合时尚与实用",
    },
    {
      icon: Heart,
      title: "品质保证",
      description: "严格的质量把控，只为给您最好的产品体验",
    },
    {
      icon: Users,
      title: "用户至上",
      description: "倾听每一位用户的声音，持续优化改进",
    },
  ];

  const stats = [
    { label: "用户数量", value: "10万+" },
    { label: "产品种类", value: "500+" },
    { label: "好评率", value: "98%" },
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
          <h1 className="text-3xl font-bold">关于我们</h1>
        </div>

        {/* Brand Card */}
        <Card className="p-8 rounded-2xl mb-6 text-center bg-primary text-primary-foreground">
          <div className="text-5xl font-bold mb-3">Fluxwear</div>
          <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 mb-4">
            手机链专家
          </Badge>
          <p className="text-sm opacity-90">
            让您的手机更时尚、更安全、更便捷
          </p>
        </Card>

        {/* Version Info */}
        <Card className="p-5 rounded-2xl mb-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold">应用版本</span>
            <span className="text-muted-foreground">v1.0.0</span>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 rounded-2xl text-center">
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* About Text */}
        <Card className="p-6 rounded-2xl mb-6">
          <h2 className="font-bold text-lg mb-4">我们的故事</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Fluxwear成立于2023年，致力于为年轻人打造时尚实用的手机配件。我们相信，手机链不仅是一个配件，更是个性和生活态度的表达。
            </p>
            <p>
              从最初的几款设计到现在超过500款产品，我们始终坚持原创设计、精选材质、精工细作。每一款产品都凝聚着设计师的心血和对品质的追求。
            </p>
            <p>
              感谢每一位用户的支持与信任，你们的反馈和建议是我们不断前进的动力。未来，我们将继续创新，带来更多惊喜。
            </p>
          </div>
        </Card>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-5 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Contact */}
        <Card className="p-6 rounded-2xl bg-muted/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold">联系我们</h3>
              <p className="text-xs text-muted-foreground">我们期待听到您的声音</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">邮箱：</span>
              contact@fluxwear.com
            </p>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">客服：</span>
              service@fluxwear.com
            </p>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">合作：</span>
              business@fluxwear.com
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default About;
