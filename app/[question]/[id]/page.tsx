import QuestionPage from "./client_page";
import axios from 'axios';

interface TaskData {
  task: number;
  question: string;
  data: {
    inputs: string[];
    outputs: string[];
  };
}

async function fetchData(taskId: number): Promise<TaskData> {
  const response = await axios.get(`https://codebutter.xyz/api/getTasks`, {
    params: { task: taskId }
  });
  return response.data;
}

export default async function QuestionPageHome({ params, searchParams }: { params: any, searchParams: string }) {
  console.log(params, searchParams);
  console.log(params.id);
  console.log('QuestionPageHome');

  const data = await fetchData(params.id);

  return (
    <div>
      {/* {JSON.stringify(data.data.inputs)}
      {JSON.stringify(data.data.outputs)} */}
      <QuestionPage taskData={data} />
    </div>
  );
}