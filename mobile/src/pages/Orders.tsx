import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Package, Truck, CheckCircle, Clock, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";

interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  product_image?: string;
  price: string;
  quantity: number;
  subtotal: string;
}

interface Order {
  id: number;
  order_no: string;
  total_amount: string;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  status_display: string;
  items: OrderItem[];
  created_at: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  tracking_no?: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      setLoading(true);
      try {
        let url = 'orders/';
        if (selectedTab !== 'all') {
          url += `?status=${selectedTab}`;
        }
        const response = await api.get(url);
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [selectedTab]);

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { label: "待支付", variant: "secondary" as const, icon: Clock },
      paid: { label: "已支付", variant: "default" as const, icon: Package },
      shipped: { label: "已发货", variant: "default" as const, icon: Truck },
      completed: { label: "已完成", variant: "secondary" as const, icon: CheckCircle },
      cancelled: { label: "已取消", variant: "destructive" as const, icon: X },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="rounded-full flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredOrders = orders;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">我的订单</h1>
        </div>

        {/* Status Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="w-full grid grid-cols-5 rounded-2xl">
            <TabsTrigger value="all" className="rounded-xl">全部</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-xl">待支付</TabsTrigger>
            <TabsTrigger value="paid" className="rounded-xl">已支付</TabsTrigger>
            <TabsTrigger value="shipped" className="rounded-xl">已发货</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-xl">已完成</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <Card className="p-12 text-center rounded-2xl">
              <p className="text-muted-foreground text-lg">加载中...</p>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card className="p-12 text-center rounded-2xl">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">暂无订单</p>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="p-4 rounded-2xl">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                  <div>
                    <p className="text-sm font-semibold">{order.order_no}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString('zh-CN')}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div
                        className="w-20 h-20 rounded-xl bg-muted bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url(${item.product_image || 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop'})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 truncate">{item.product_name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <p className="font-bold">¥{parseFloat(item.price).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">订单总额</p>
                    <p className="text-xl font-bold">¥{parseFloat(order.total_amount).toFixed(2)}</p>
                  </div>
                  <Button variant="outline" className="rounded-full">
                    查看详情
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
