import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Package, Truck, CheckCircle, Clock, X } from "lucide-react";
import { Link } from "react-router-dom";

interface OrderItem {
  id: string;
  name: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  total: number;
  shippingAddress: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    date: "2024-11-25",
    status: "delivered",
    items: [
      {
        id: "1",
        name: "Pearl Chain",
        color: "White",
        price: 39.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop",
      },
    ],
    total: 39.99,
    shippingAddress: "123 Main St, City, State 12345",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    date: "2024-11-28",
    status: "shipped",
    items: [
      {
        id: "2",
        name: "Metal Chain Pro",
        color: "Silver",
        price: 49.99,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop",
      },
    ],
    total: 99.98,
    shippingAddress: "456 Oak Ave, City, State 12345",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    date: "2024-11-29",
    status: "processing",
    items: [
      {
        id: "3",
        name: "Beaded Chain",
        color: "Black",
        price: 29.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop",
      },
    ],
    total: 29.99,
    shippingAddress: "789 Pine Rd, City, State 12345",
  },
];

const Orders = () => {
  const [selectedTab, setSelectedTab] = useState("all");

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { label: "待支付", variant: "secondary" as const, icon: Clock },
      processing: { label: "处理中", variant: "default" as const, icon: Package },
      shipped: { label: "已发货", variant: "default" as const, icon: Truck },
      delivered: { label: "已完成", variant: "secondary" as const, icon: CheckCircle },
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

  const filterOrders = (status: string) => {
    if (status === "all") return mockOrders;
    return mockOrders.filter((order) => order.status === status);
  };

  const filteredOrders = filterOrders(selectedTab);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">我的订单</h1>
        </div>

        {/* Status Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="w-full grid grid-cols-5 rounded-2xl">
            <TabsTrigger value="all" className="rounded-xl">全部</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-xl">待支付</TabsTrigger>
            <TabsTrigger value="processing" className="rounded-xl">处理中</TabsTrigger>
            <TabsTrigger value="shipped" className="rounded-xl">已发货</TabsTrigger>
            <TabsTrigger value="delivered" className="rounded-xl">已完成</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
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
                    <p className="text-sm font-semibold">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div
                        className="w-20 h-20 rounded-xl bg-muted bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">颜色: {item.color}</p>
                        <div className="flex items-center justify-between">
                          <p className="font-bold">${item.price.toFixed(2)}</p>
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
                    <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
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
