
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";

export function CustomerTab() {
  return (
    <div className="flex w-full flex-col gap-6 pt-2">
      <Tabs defaultValue="cheque">
        <TabsList className="w-full flex justify-center">
          <TabsTrigger value="cheque">Transferencia de Cheque</TabsTrigger>
          <TabsTrigger value="bancaria">Transferencia Bancaria</TabsTrigger>
        </TabsList>
        <TabsContent value="cheque">
          <Table>
            <TableHeader>
              <TableRow className="flex justify-around">
                <TableHead>Id</TableHead>
                <TableHead>Code</TableHead>
                 <TableHead>Cantidad</TableHead>
                  <TableHead>Comision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="bancaria">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">Current password</Label>
                <Input id="tabs-demo-current" type="password" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-new">New password</Label>
                <Input id="tabs-demo-new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
