import { useState } from "react";
import { ChevronRight, Check, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const LanguageSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const languages: Language[] = [
    { code: "zh-CN", name: "Simplified Chinese", nativeName: "简体中文" },
    { code: "zh-TW", name: "Traditional Chinese", nativeName: "繁體中文" },
    { code: "en", name: "English", nativeName: "English" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
    { code: "ko", name: "Korean", nativeName: "한국어" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState("zh-CN");

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    const language = languages.find(l => l.code === code);
    toast({
      title: "语言已更改",
      description: `已切换至${language?.nativeName}`,
    });
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
          <h1 className="text-3xl font-bold">语言设置</h1>
        </div>

        {/* Current Language */}
        <Card className="p-6 rounded-2xl mb-6 bg-primary text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Globe className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">当前语言</p>
              <p className="text-xl font-bold">
                {languages.find(l => l.code === selectedLanguage)?.nativeName}
              </p>
            </div>
          </div>
        </Card>

        {/* Language List */}
        <div className="space-y-2">
          {languages.map((language) => (
            <Card
              key={language.code}
              className={`p-5 rounded-2xl cursor-pointer transition-all ${
                selectedLanguage === language.code
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">{language.nativeName}</p>
                  <p className={`text-sm ${
                    selectedLanguage === language.code
                      ? "opacity-90"
                      : "text-muted-foreground"
                  }`}>
                    {language.name}
                  </p>
                </div>
                {selectedLanguage === language.code && (
                  <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Info */}
        <Card className="p-6 rounded-2xl mt-6 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            更改语言后，应用界面将立即切换至所选语言。部分内容可能需要重新加载页面后生效。
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default LanguageSettings;
