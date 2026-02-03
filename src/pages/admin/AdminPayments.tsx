import { useState } from "react";
import { useAdminData } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Loader2,
  Shield,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const paymentIcons: Record<string, string> = {
  phonepe: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png",
  cashfree: "https://www.cashfree.com/devstudio/images/cf-logo.svg",
};

const paymentDocs: Record<string, string> = {
  phonepe: "https://developer.phonepe.com/",
  cashfree: "https://docs.cashfree.com/",
};

const AdminPayments = () => {
  const { paymentGateways, loading, updatePaymentGateway } = useAdminData();
  const [saving, setSaving] = useState<string | null>(null);
  const [configs, setConfigs] = useState<Record<string, any>>({});

  const handleConfigChange = (gatewayId: string, key: string, value: string) => {
    setConfigs((prev) => ({
      ...prev,
      [gatewayId]: {
        ...(prev[gatewayId] || {}),
        [key]: value,
      },
    }));
  };

  const handleToggleActive = async (gateway: any) => {
    setSaving(gateway.id);
    const { error } = await updatePaymentGateway(gateway.id, {
      is_active: !gateway.is_active,
    });
    if (error) {
      toast.error("Failed to update gateway");
    } else {
      toast.success(
        `${gateway.name} ${!gateway.is_active ? "enabled" : "disabled"}`
      );
    }
    setSaving(null);
  };

  const handleToggleTestMode = async (gateway: any) => {
    setSaving(gateway.id);
    const { error } = await updatePaymentGateway(gateway.id, {
      is_test_mode: !gateway.is_test_mode,
    });
    if (error) {
      toast.error("Failed to update gateway");
    } else {
      toast.success(
        `${gateway.name} switched to ${!gateway.is_test_mode ? "test" : "live"} mode`
      );
    }
    setSaving(null);
  };

  const handleSaveConfig = async (gateway: any) => {
    const newConfig = configs[gateway.id];
    if (!newConfig) return;

    setSaving(gateway.id);
    const mergedConfig = { ...gateway.config, ...newConfig };
    const { error } = await updatePaymentGateway(gateway.id, {
      config: mergedConfig,
    });
    if (error) {
      toast.error("Failed to save configuration");
    } else {
      toast.success("Configuration saved");
      setConfigs((prev) => {
        const updated = { ...prev };
        delete updated[gateway.id];
        return updated;
      });
    }
    setSaving(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Payment Gateways
        </h1>
        <p className="font-body text-muted-foreground">
          Configure payment methods for your store
        </p>
      </div>

      {/* Info Banner */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground mb-1">
              Secure Payment Integration
            </h3>
            <p className="font-body text-sm text-muted-foreground">
              Your API keys are encrypted and stored securely. We recommend
              testing in sandbox mode before going live. Never share your secret
              keys.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateways */}
      <div className="grid gap-6">
        {paymentGateways.map((gateway, index) => (
          <motion.div
            key={gateway.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center p-2 shadow">
                      {paymentIcons[gateway.provider] ? (
                        <img
                          src={paymentIcons[gateway.provider]}
                          alt={gateway.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <CreditCard className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="font-display text-xl flex items-center gap-2">
                        {gateway.name}
                        {gateway.is_active && (
                          <Badge className="bg-green-100 text-green-600 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                        {gateway.is_test_mode && gateway.is_active && (
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-600 border-yellow-200"
                          >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Test Mode
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="font-body">
                        {gateway.provider === "phonepe"
                          ? "Accept UPI, cards, wallets via PhonePe"
                          : "Accept cards, UPI, netbanking via Cashfree"}
                      </CardDescription>
                    </div>
                  </div>
                  <a
                    href={paymentDocs[gateway.provider]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-body text-primary hover:underline flex items-center gap-1"
                  >
                    View Docs
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Toggles */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={gateway.is_active}
                      onCheckedChange={() => handleToggleActive(gateway)}
                      disabled={saving === gateway.id}
                    />
                    <Label className="font-body">Enable Gateway</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={gateway.is_test_mode}
                      onCheckedChange={() => handleToggleTestMode(gateway)}
                      disabled={saving === gateway.id || !gateway.is_active}
                    />
                    <Label className="font-body">Test Mode</Label>
                  </div>
                </div>

                {/* Config Fields */}
                <div className="space-y-4">
                  <h4 className="font-body text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    API Configuration
                  </h4>
                  {gateway.provider === "phonepe" && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${gateway.id}-merchant_id`}>
                          Merchant ID
                        </Label>
                        <Input
                          id={`${gateway.id}-merchant_id`}
                          type="text"
                          placeholder="Enter Merchant ID"
                          defaultValue={gateway.config?.merchant_id || ""}
                          onChange={(e) =>
                            handleConfigChange(
                              gateway.id,
                              "merchant_id",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${gateway.id}-salt_key`}>
                          Salt Key
                        </Label>
                        <Input
                          id={`${gateway.id}-salt_key`}
                          type="password"
                          placeholder="Enter Salt Key"
                          defaultValue={gateway.config?.salt_key || ""}
                          onChange={(e) =>
                            handleConfigChange(
                              gateway.id,
                              "salt_key",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${gateway.id}-salt_index`}>
                          Salt Index
                        </Label>
                        <Input
                          id={`${gateway.id}-salt_index`}
                          type="text"
                          placeholder="1"
                          defaultValue={gateway.config?.salt_index || "1"}
                          onChange={(e) =>
                            handleConfigChange(
                              gateway.id,
                              "salt_index",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                  {gateway.provider === "cashfree" && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${gateway.id}-app_id`}>App ID</Label>
                        <Input
                          id={`${gateway.id}-app_id`}
                          type="text"
                          placeholder="Enter App ID"
                          defaultValue={gateway.config?.app_id || ""}
                          onChange={(e) =>
                            handleConfigChange(
                              gateway.id,
                              "app_id",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${gateway.id}-secret_key`}>
                          Secret Key
                        </Label>
                        <Input
                          id={`${gateway.id}-secret_key`}
                          type="password"
                          placeholder="Enter Secret Key"
                          defaultValue={gateway.config?.secret_key || ""}
                          onChange={(e) =>
                            handleConfigChange(
                              gateway.id,
                              "secret_key",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                {configs[gateway.id] && (
                  <div className="pt-4 border-t border-border">
                    <Button
                      onClick={() => handleSaveConfig(gateway)}
                      disabled={saving === gateway.id}
                    >
                      {saving === gateway.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Save Configuration
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminPayments;
