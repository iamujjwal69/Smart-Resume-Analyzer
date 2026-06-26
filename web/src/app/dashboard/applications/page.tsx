"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, GripVertical, Building2, MapPin, Calendar, CheckCircle2, Clock, XCircle, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApplicationModal } from "@/components/ApplicationModal";
import { toast } from "sonner";

type Application = {
  id: string;
  company: string;
  role: string;
  status: string;
  salaryRange?: string;
  location?: string;
  kanbanOrder: number;
  appliedAt?: string;
};

const COLUMNS = [
  { id: "WISHLIST", title: "Wishlist", icon: Clock, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-800/50" },
  { id: "APPLIED", title: "Applied", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "ONLINE_ASSESSMENT", title: "Assessment", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  { id: "INTERVIEW", title: "Interviewing", icon: Calendar, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { id: "OFFER", title: "Offer", icon: Award, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
  { id: "REJECTED", title: "Rejected", icon: XCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      if (Array.isArray(data)) {
        setApplications(data);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const draggedApp = applications.find((app) => app.id === draggableId);
    if (!draggedApp) return;

    // Optimistic UI update
    const newStatus = destination.droppableId;
    
    // Sort applications by status and order
    const colApps = applications.filter(a => a.status === newStatus).sort((a, b) => a.kanbanOrder - b.kanbanOrder);
    
    // Calculate new order
    let newOrder = 1024;
    if (colApps.length === 0) {
      newOrder = 1024;
    } else if (destination.index === 0) {
      newOrder = colApps[0].kanbanOrder / 2;
    } else if (destination.index === colApps.length) {
      newOrder = colApps[colApps.length - 1].kanbanOrder + 1024;
    } else {
      const prevOrder = colApps[destination.index - 1].kanbanOrder;
      const nextOrder = colApps[destination.index].kanbanOrder;
      newOrder = (prevOrder + nextOrder) / 2;
    }

    const updatedApps = applications.map((app) => {
      if (app.id === draggableId) {
        return { ...app, status: newStatus, kanbanOrder: newOrder };
      }
      return app;
    });

    setApplications(updatedApps);

    // Persist to backend
    try {
      await fetch(`/api/applications/${draggableId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, kanbanOrder: newOrder }),
      });
    } catch (error) {
      toast.error("Failed to update status. Please try again.");
      fetchApplications(); // Revert on failure
    }
  };

  const handleOpenModal = (app?: Application) => {
    setEditingApp(app || null);
    setIsModalOpen(true);
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header and Action Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Application Tracker</h1>
          <p className="text-muted-foreground mt-1">Organize and visualize your job search pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => handleOpenModal()} className="gradient-btn font-semibold">
            <Plus className="h-4 w-4 mr-2" /> Add Job
          </Button>
        </div>
      </div>

      {/* Mini Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-1">
        <div className="bg-card border border-border/60 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Active</span>
          <span className="text-2xl font-bold mt-1">
            {applications.filter(a => a.status !== "REJECTED").length}
          </span>
        </div>
        <div className="bg-card border border-border/60 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider text-blue-500">Applied</span>
          <span className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
            {applications.filter(a => a.status === "APPLIED").length}
          </span>
        </div>
        <div className="bg-card border border-border/60 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider text-purple-500">Interviewing</span>
          <span className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
            {applications.filter(a => a.status === "INTERVIEW").length}
          </span>
        </div>
        <div className="bg-card border border-border/60 rounded-xl p-4 flex flex-col">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider text-green-500">Offers</span>
          <span className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
            {applications.filter(a => a.status === "OFFER").length}
          </span>
        </div>
      </div>

      {/* Kanban Board Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-6 h-[calc(100vh-290px)] select-none">
          {COLUMNS.map((column) => {
            const columnApps = applications
              .filter((app) => app.status === column.id)
              .sort((a, b) => a.kanbanOrder - b.kanbanOrder);

            const Icon = column.icon;

            return (
              <div key={column.id} className="flex-shrink-0 w-80 flex flex-col rounded-2xl bg-muted/30 dark:bg-muted/10 border border-border/50 overflow-hidden">
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between border-b border-border/30 bg-muted/10">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-card border border-border/40`}>
                      <Icon className={`h-4 w-4 ${column.color}`} />
                    </div>
                    <h3 className="font-bold text-sm tracking-tight">{column.title}</h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted-foreground/10 text-muted-foreground">
                    {columnApps.length}
                  </span>
                </div>

                {/* Droppable Card Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-4 overflow-y-auto space-y-3 transition-colors duration-200 ${
                        snapshot.isDraggingOver ? 'bg-primary/5 dark:bg-primary/3' : ''
                      }`}
                    >
                      {columnApps.map((app, index) => (
                        <Draggable key={app.id} draggableId={app.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`cursor-grab active:cursor-grabbing border border-border/70 hover:border-primary/40 dark:hover:border-primary/30 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] transition-all duration-200 ${
                                snapshot.isDragging 
                                  ? 'shadow-xl border-primary dark:border-primary ring-2 ring-primary/20 scale-102 rotate-1' 
                                  : 'bg-card hover:-translate-y-0.5 hover:shadow-md'
                              }`}
                              onClick={() => handleOpenModal(app)}
                            >
                              <CardContent className="p-4 relative group">
                                <div
                                  {...provided.dragHandleProps}
                                  className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground cursor-grab"
                                >
                                  <GripVertical className="h-4 w-4" />
                                </div>
                                <h4 className="font-bold text-base leading-tight tracking-tight line-clamp-1 pr-6 text-foreground/90">{app.role}</h4>
                                <div className="flex items-center text-muted-foreground mt-2 text-xs font-medium">
                                  <Building2 className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                                  <span className="line-clamp-1">{app.company}</span>
                                </div>
                                
                                {(app.location || app.salaryRange) && (
                                  <div className="flex flex-wrap gap-2 mt-4 pt-3.5 border-t border-border/40">
                                    {app.location && (
                                      <div className="flex items-center text-[11px] text-muted-foreground font-medium">
                                        <MapPin className="h-3 w-3 mr-1 opacity-70" /> {app.location}
                                      </div>
                                    )}
                                    {app.salaryRange && (
                                      <Badge variant="secondary" className="text-[10px] font-semibold tracking-wide bg-primary/8 text-primary border-0 rounded px-1.5 py-0">
                                        {app.salaryRange}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <ApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        application={editingApp}
        onSave={fetchApplications}
      />
    </div>
  );
}
