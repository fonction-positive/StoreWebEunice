import { useState } from "react";
import { ChevronRight, Search, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const faqs: FAQ[] = [
    {
      category: "订单相关",
      question: "如何查看我的订单状态？",
      answer: "您可以在【我的订单】页面查看所有订单的实时状态。点击具体订单可以查看详细的物流信息和预计送达时间。",
    },
    {
      category: "订单相关",
      question: "可以取消订单吗？",
      answer: "待支付的订单可以直接取消。已支付的订单如果还未发货，可以申请取消并退款。已发货的订单需要等收货后申请退货退款。",
    },
    {
      category: "支付相关",
      question: "支持哪些支付方式？",
      answer: "我们支持微信支付、支付宝、银联卡支付等多种支付方式。所有支付渠道都经过加密处理，确保您的资金安全。",
    },
    {
      category: "支付相关",
      question: "退款需要多久到账？",
      answer: "退款申请审核通过后，款项会在1-7个工作日内原路退回。具体到账时间取决于您的支付方式和银行处理速度。",
    },
    {
      category: "配送相关",
      question: "配送需要多长时间？",
      answer: "一般情况下，国内订单2-5个工作日送达。偏远地区可能需要额外1-3天。您可以在订单详情中查看预计送达时间。",
    },
    {
      category: "配送相关",
      question: "可以修改收货地址吗？",
      answer: "订单未发货前，可以在订单详情页修改收货地址。订单已发货后，地址无法修改，建议联系客服协助处理。",
    },
    {
      category: "产品相关",
      question: "产品尺寸如何选择？",
      answer: "每个产品页面都有详细的尺寸说明和规格参数。手机链类产品通常是通用尺寸，适配大多数手机。如有疑问可咨询客服。",
    },
    {
      category: "产品相关",
      question: "产品质量有保障吗？",
      answer: "我们承诺所有产品均为正品，提供质量保证。如收到的产品存在质量问题，可以在7天内申请退换货。",
    },
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const filteredFaqs = searchQuery
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

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
          <h1 className="text-3xl font-bold">帮助中心</h1>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="搜索问题..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-2xl"
          />
        </div>

        {/* Contact Support */}
        <Card className="p-5 rounded-2xl mb-6 bg-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold">联系客服</p>
                <p className="text-sm opacity-90">在线客服 9:00-21:00</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5" />
          </div>
        </Card>

        {/* FAQ by Category */}
        {categories.map((category) => {
          const categoryFaqs = filteredFaqs.filter(faq => faq.category === category);
          
          if (categoryFaqs.length === 0) return null;

          return (
            <div key={category} className="mb-6">
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                {category}
              </h2>
              <Card className="rounded-2xl overflow-hidden">
                <Accordion type="single" collapsible className="w-full">
                  {categoryFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-b-0 px-5">
                      <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <Card className="p-12 rounded-2xl text-center">
            <p className="text-muted-foreground mb-2">未找到相关问题</p>
            <p className="text-sm text-muted-foreground">
              试试其他关键词，或联系客服获取帮助
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default HelpCenter;
