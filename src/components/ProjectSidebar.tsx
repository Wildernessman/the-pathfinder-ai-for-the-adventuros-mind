import { Check, Loader2, X } from "lucide-react";

type Project = {
  id: number;
  name: string;
  status: 'completed' | 'in-progress' | 'cancelled';
};

interface ProjectSidebarProps {
  isOpen: boolean;
}

const projects: Project[] = [
  { id: 1, name: "E-commerce Website", status: "completed" },
  { id: 2, name: "Task Manager App", status: "in-progress" },
  { id: 3, name: "Portfolio Site", status: "in-progress" },
  { id: 4, name: "Weather Dashboard", status: "cancelled" },
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

  return (
    <div 
      className={`fixed top-[60px] right-0 h-full w-64 bg-chatgpt-main border-l border-white/20 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Look Out Point: "Nature's Algorithm"</h2>
        <div className="space-y-3">
          
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
