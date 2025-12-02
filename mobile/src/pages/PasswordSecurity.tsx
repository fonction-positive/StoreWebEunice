import { useState } from "react";
import { ChevronRight, Lock, Shield, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "请输入当前密码"),
  newPassword: z.string()
    .min(6, "密码至少6个字符")
    .max(32, "密码最多32个字符"),
  confirmPassword: z.string().min(1, "请确认新密码"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const PasswordSecurity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await api.put('auth/password_change/', {
        old_password: data.currentPassword,
        new_password: data.newPassword,
      });
      toast({
        title: "密码修改成功",
        description: "您的密码已成功更新",
      });
      form.reset();
    } catch (error: any) {
      console.error('Password change failed:', error);
      const errorMsg = error.response?.data?.old_password?.[0] || 
                       error.response?.data?.detail || 
                       "密码修改失败";
      toast({
        title: "修改失败",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

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
          <h1 className="text-3xl font-bold">密码与安全</h1>
        </div>

        {/* Change Password Form */}
        <Card className="p-6 rounded-2xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold">修改密码</h2>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>当前密码</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="请输入当前密码" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>新密码</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="至少6个字符" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>确认新密码</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="请再次输入新密码" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full rounded-full font-semibold">
                确认修改
              </Button>
            </form>
          </Form>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="p-6 rounded-2xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold">两步验证</h3>
                <p className="text-xs text-muted-foreground">增强账户安全性</p>
              </div>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>
          {twoFactorEnabled && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                启用两步验证后，登录时需要输入手机验证码
              </p>
              <Button variant="outline" className="w-full rounded-full font-semibold">
                <Smartphone className="h-4 w-4 mr-2" />
                绑定手机号
              </Button>
            </div>
          )}
        </Card>

        {/* Security Tips */}
        <Card className="p-6 rounded-2xl bg-muted/50">
          <h3 className="font-bold mb-3">安全提示</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 定期更换密码，建议每3个月更换一次</li>
            <li>• 不要使用与其他网站相同的密码</li>
            <li>• 开启两步验证可以大幅提升账户安全性</li>
            <li>• 不要将密码告诉任何人</li>
          </ul>
        </Card>
      </div>
    </Layout>
  );
};

export default PasswordSecurity;
