import { useState, useEffect } from "react";
import { ChevronRight, Plus, MapPin, Phone, User, Home, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: number;
  recipient_name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  is_default: boolean;
}

const AddressManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await api.get('addresses/');
      setAddresses(response.data);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      toast({
        title: "加载失败",
        description: "无法加载地址列表",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      await api.put(`addresses/${addressId}/`, { is_default: true });
      await fetchAddresses();
      toast({
        title: "设置成功",
        description: "已设为默认地址",
      });
    } catch (error) {
      console.error('Failed to set default address:', error);
      toast({
        title: "设置失败",
        description: "无法设置默认地址",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-6 flex items-center justify-center">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </Layout>
    );
  }

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
            <h1 className="text-3xl font-bold">地址管理</h1>
          </div>
        </div>

        {/* Add New Address Button */}
        <Button
          className="w-full h-14 rounded-2xl mb-6 font-semibold"
          size="lg"
          onClick={() => toast({ title: "功能开发中", description: "该功能即将上线" })}
        >
          <Plus className="h-5 w-5 mr-2" />
          添加新地址
        </Button>

        {/* Address List */}
        <div className="space-y-3">
          {addresses.map((address) => {
            
            return (
              <Card key={address.id} className="p-5 rounded-2xl">
                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{address.recipient_name}</span>
                          {address.is_default && (
                            <Badge className="rounded-full px-2 py-0.5 text-xs">
                              默认
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{address.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      {address.province} {address.city} {address.district} {address.address}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full font-semibold"
                      onClick={() => toast({ title: "功能开发中", description: "该功能即将上线" })}
                    >
                      编辑
                    </Button>
                    {!address.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full font-semibold"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        设为默认
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State - Hidden when there are addresses */}
        {addresses.length === 0 && (
          <Card className="p-12 rounded-2xl text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">暂无收货地址</p>
            <Button className="rounded-full font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              添加地址
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AddressManagement;
