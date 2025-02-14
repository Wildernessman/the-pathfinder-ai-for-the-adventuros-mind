
import { Check, Loader2, X, Calendar, Flag, Users } from "lucide-react";
import { Progress } from "./ui/progress";

type Priority = 'low' | 'medium' | 'high';

type Project = {
  id: number;
  name: string;
  status: 'completed' | 'in-progress' | 'cancelled';
  description: string;
  dueDate: string;
  priority: Priority;
  progress: number;
  teamMembers: string[];
};

interface ProjectSidebarProps {
  isOpen: boolean;
}

const projects: Project[] = [
  {
    id: 1,
    name: "Nature's Algorithm Phase 1",
    status: "in-progress",
    description: "Initial research and development phase for the Nature's Algorithm project.",
    dueDate: "2024-05-01",
    priority: "high",
    progress: 65,
    teamMembers: ["Alice", "Bob", "Charlie"]
  }
];

const ProjectSidebar = ({ isOpen }: ProjectSidebarProps) => {
  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-red-500" />;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'low':
        return 'text-blue-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
    }
  };

  return (
    <div 
      className={`fixed top-[60px] right-0 h-full w-80 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{
        backgroundImage: "url('/lovable-uploads/7d6fca56-e8d8-4d7f-8d4b-af569d985798.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="h-full w-full bg-black/50 backdrop-blur-sm">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-gradient">Look Out Point: "Nature's Algorithm"</h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-black/30 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{project.name}</h3>
                  {getStatusIcon(project.status)}
                </div>
                
                <p className="text-sm text-gray-300">{project.description}</p>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Flag className={`h-4 w-4 ${getPriorityColor(project.priority)}`} />
                  <span className="capitalize">{project.priority} Priority</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span>Team: {project.teamMembers.join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
