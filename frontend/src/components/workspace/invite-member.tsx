import { inviteMemberSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { Label } from "../ui/label";
import { useInviteMemberMutation } from "app/hooks/use-workspace";
import { toast } from "sonner";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

const ROLES = ["admin", "member", "viewer"];

export const InviteMemberDialog = ({
  isOpen,
  onOpenChange,
  workspaceId,
}: InviteMemberDialogProps) => {
  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const { mutate, isPending } = useInviteMemberMutation();

  const [inviteTab, setInviteTab] = useState("email");
  const [linkCopied, setLinkCopied] = useState(false);

  const onSubmit = async (data: InviteMemberFormData) => {
    if (!workspaceId) return;

    mutate(
      {
        workspaceId,
        ...data,
      },
      {
        onSuccess: () => {
          toast.success("Invite sent successfully");
          form.reset();
          setInviteTab("email");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
          console.log(error);
        },
      },
    );
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/workspace-invite/${workspaceId}`,
    );
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader className="">
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Invite a new member to your workspace
          </DialogDescription>
        </DialogHeader>

        <Tabs value={inviteTab} onValueChange={setInviteTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="email" disabled={isPending}>
              Send Email
            </TabsTrigger>
            <TabsTrigger value="link">Share Link</TabsTrigger>
          </TabsList>

          {/* EMAIL TAB */}
          <TabsContent value="email" className="mt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* EMAIL */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input placeholder="example@gmail.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* ROLE */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-3">
                          {ROLES.map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => field.onChange(role)}
                              className={cn(
                                "rounded-lg border px-3 py-2 text-sm capitalize transition",
                                field.value === role
                                  ? "border-primary bg-primary text-white cursor-default"
                                  : "border-border hover:bg-muted",
                              )}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* ACTION */}
                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={isPending}
                >
                  Send Invitation
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* LINK TAB */}
          <TabsContent value="link" className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Share this link to invite people</Label>
            </div>

            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={`${window.location.origin}/workspace-invite/${workspaceId}`}
              />
              <Button onClick={handleCopyInviteLink}>
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy
                  </>
                )}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground pt-2">
              Anyone with this link can join to this Workspace
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
