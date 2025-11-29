import { useState } from "react";
import { ChevronRight, Plus, MapPin, Phone, User, Home, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
  type: "home" | "work";
}

const AddressManagement = () => {
  const navigate = useNavigate();
  
  const [addresses] = useState<Address[]>([
    {
      id: "1",
      name: "张三",
      phone: "138****8888",
      address: "北京市朝阳区望京街道某某小区 10号楼 202室",
      isDefault: true,
      type: "home",
    },
    {
      id: "2",
      name: "张三",
      phone: "138****8888",
      address: "上海市浦东新区陆家嘴金融中心 写字楼A座 15层",
      isDefault: false,
      type: "work",
    },
  ]);

  const getTypeIcon = (type: "home" | "work") => {
    return type === "home" ? Home : Briefcase;
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
            <h1 className="text-3xl font-bold">地址管理</h1>
          </div>
        </div>

        {/* Add New Address Button */}
        <Button
          className="w-full h-14 rounded-2xl mb-6 font-semibold"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          添加新地址
        </Button>

        {/* Address List */}
        <div className="space-y-3">
          {addresses.map((address) => {
            const TypeIcon = getTypeIcon(address.type);
            
            return (
              <Card key={address.id} className="p-5 rounded-2xl">
                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{address.name}</span>
                          {address.isDefault && (
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
                    <p className="text-sm">{address.address}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full font-semibold"
                    >
                      编辑
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full font-semibold"
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
