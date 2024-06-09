import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function TabsDemo() {
    return (
      <Tabs defaultValue="account" className="w-full max-w-[800px] mx-auto">
        {/* Add mb-4 (margin-bottom) for mobile views to TabsList */}
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-10 sm:mb-0">
          <TabsTrigger value="account">Talk To PDFs</TabsTrigger>
          <TabsTrigger value="password">Write Essays(alpha)</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <video
              className="mx-auto w-full max-w-[600px] aspect-video overflow-hidden rounded-xl object-cover object-center"
              controls
              autoPlay
              muted
            >
              <source src="https://studybuddysgp.s3.ap-southeast-1.amazonaws.com/before+copy.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <video
            className="mx-auto w-full max-w-[600px] aspect-video overflow-hidden rounded-xl object-cover object-center"
            controls
            autoPlay
            muted
          >
            <source src="https://studybuddysgp.s3.ap-southeast-1.amazonaws.com/after.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </TabsContent>
      </Tabs>
    )
  }