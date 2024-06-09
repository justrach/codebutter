import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EvervaultCard } from './ui/framerui/evervault-card';

export function CodingHomePage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1 bg-[#F7DCB9] dark:bg-gray-950 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-dotted">
        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Featured Challenges</h2>
            <Link
              href="#"
              className="text-sm font-medium text-[#dfc7a7] hover:underline"
              prefetch={false}
            >
              View All
            </Link>
          </div>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <EvervaultCard text="Reverse a Linked List" />
                <CardDescription>
                  Given the head of a singly linked list, reverse the list.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Easy
                  </div>
                  <Button size="sm">Practice</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Valid Parentheses</CardTitle>
                <CardDescription>
                  Given a string s containing just the characters '(', ')', ',
                  ', '[' and ']', determine if the input string is valid.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Medium
                  </div>
                  <Button size="sm">Practice</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Practice by Topic</h2>
            <Link
              href="#"
              className="text-sm font-medium text-blue-500 hover:underline"
              prefetch={false}
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="#"
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              prefetch={false}
            >
              <div className="text-sm font-medium">Arrays</div>
              <ChevronRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Link>
            <Link
              href="#"
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              prefetch={false}
            >
              <div className="text-sm font-medium">Strings</div>
              <ChevronRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Link>
            <Link
              href="#"
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              prefetch={false}
            >
              <div className="text-sm font-medium">Algorithms</div>
              <ChevronRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Link>
            <Link
              href="#"
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              prefetch={false}
            >
              <div className="text-sm font-medium">Data Structures</div>
              <ChevronRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Link>
          </div>
        </section>
        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-4 col-span-1 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Submissions</h2>
            <Link
              href="#"
              className="text-sm font-medium text-blue-500 hover:underline"
              prefetch={false}
            >
              View All
            </Link>
          </div>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Reverse a Linked List</CardTitle>
                <CardDescription>Submitted 2 hours ago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Accepted
                  </div>
                  <div className="text-sm font-medium text-green-500">100%</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Valid Parentheses</CardTitle>
                <CardDescription>Submitted 4 hours ago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Accepted
                  </div>
                  <div className="text-sm font-medium text-green-500">95%</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-4 col-span-1 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Leaderboard</h2>
            <Link
              href="#"
              className="text-sm font-medium text-blue-500 hover:underline"
              prefetch={false}
            >
              View All
            </Link>
          </div>
          <div className="grid gap-4">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-medium">John Doe</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      1,234 points
                    </div>
                  </div>
                </div>
                <Button size="sm">View Profile</Button>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-medium">Jane Smith</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      1,123 points
                    </div>
                  </div>
                </div>
                <Button size="sm">View Profile</Button>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-medium">Bob Johnson</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      1,050 points
                    </div>
                  </div>
                </div>
                <Button size="sm">View Profile</Button>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

function ChevronRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
