import { cn } from '@/utils/cn';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EvervaultCard } from '../framerui/evervault-card';

export const ChallengeCard = ({
  className,
  title,
  description,
  difficulty,
}: {
  className?: string;
  title: string;
  description: string;
  difficulty: string;
}) => {
  return (
    <Card
      className={cn(
        'group/challenge hover:shadow-xl transition duration-200',
        className,
      )}
    >
      <CardHeader>
        <EvervaultCard text={title} />
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {difficulty}
          </div>
          <Button
            size="sm"
            className="group-hover/challenge:translate-x-2 transition duration-200"
          >
            Practice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
