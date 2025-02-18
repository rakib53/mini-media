import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import React, { useState } from "react";

interface Module {
  _id: string;
  title: string;
  position: number;
}

interface ModulesListProps {
  modules: Module[];
  courseId: string;
}

const ModulesList: React.FC<ModulesListProps> = ({ modules }) => {
  const [moduleList, setModuleList] = useState<Module[]>(modules);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(moduleList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions based on the new order
    const updatedList = items.map((module, index) => ({
      ...module,
      position: index + 1,
    }));

    setModuleList(updatedList);

    const reorderedIds = updatedList.map((module) => module._id);

    try {
      // Uncomment this line when the backend endpoint is ready
      // await axios.put('/modules/reorder', { courseId, reorderedModules: reorderedIds });
    } catch (error) {}
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="modules">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {moduleList.map((module, index) => (
              <Draggable
                key={module._id}
                draggableId={module._id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-4 border-b bg-white"
                  >
                    {module.title}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ModulesList;
