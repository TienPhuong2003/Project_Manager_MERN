import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetWorkspaceDetail } from "app/hooks/use-workspace";
import type { Workspace } from "app/types";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const Members = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const initialSearch = searchParams.get("search") || "";
  const tabActive = searchParams.get("tab") || "list";
  const [search, setSearch] = useState<string>(initialSearch);

  const { data, isLoading } = useGetWorkspaceDetail(workspaceId!) as {
    data: Workspace;
    isLoading: boolean;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    params.search = search;

    setSearchParams(params, { replace: true });
  }, [search]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (!workspaceId || !data) return <div>No workspace found</div>;
  //filter
  const filteredMembers =
    data?.members?.filter(
      (member) =>
        member.user.name.toLowerCase().includes(search.toLowerCase()) ||
        member.user.email.toLowerCase().includes(search.toLowerCase()) ||
        member.role?.toLowerCase().includes(search.toLowerCase()),
    ) || [];
  console.log(data);

  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center justify-between">
        <h1 className="text-2xl font-bold">Workspace Members</h1>
      </div>

      <Input
        placeholder="Search member..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <Tabs
        value={tabActive}
        onValueChange={(value) => {
          searchParams.set("tab", value);
          setSearchParams(searchParams);
        }}
      >
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="board">Grid</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                {filteredMembers?.length} member in your workspace
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="divide-y">
                {filteredMembers.map((member) => (
                  <div
                    key={member.user._id}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="size-10">
                        <AvatarImage src={member.user.profilePicture} className=""/>
                        <AvatarFallback className="uppercase">
                          {member.user.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-medium leading-none">
                          {member.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          ["admin", "owner"].includes(member.role)
                            ? "destructive"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="board">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <Card
                key={member.user._id}
                className="hover:shadow-md transition cursor-pointer"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Avatar className="size-20 mb-4">
                    <AvatarImage src={member.user.profilePicture} />
                    <AvatarFallback className="uppercase text-lg">
                      {member.user.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="text-base font-semibold">
                    {member.user.name}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-3">
                    {member.user.email}
                  </p>

                  <Badge
                    variant={
                      ["admin", "owner"].includes(member.role)
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {member.role}
                  </Badge>
                </CardContent>

                {filteredMembers.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground text-sm">
                      No members found
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Members;
