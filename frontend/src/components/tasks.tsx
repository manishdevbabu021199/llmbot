import "./css/tasks.css";
export default function Tasks({ tasks }: any) {
  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="flex flex-row gap-2 items-center">
        <h3 className="task-header">Tasks</h3>
      </div>
      <div className="flex flex-col gap-1 scroll-container w-full h-full">
        {tasks.length > 0 ? (
          tasks.map((task: any) => (
            <div
              key={task.taskid}
              className="flex flex-col task p-1 relative cursor-pointer"
            >
              <div>
                <h5 className="task-content">{task.taskname}</h5>
                <div className="task-name">view conversation</div>
              </div>
            </div>
          ))
        ) : (
          <h5 className="no-task pt-10">No Tasks</h5>
        )}
      </div>
    </div>
  );
}
