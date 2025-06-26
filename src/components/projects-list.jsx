"use client";

import { useData } from "@/lib/data-context";

export default function ProjectsList() {
  const { data } = useData();
  const { nodes, relationships } = data;

  const projects = nodes.filter((n) => n.type === "Project");

  const getProjectLead = (projectId) => {
    const leadRel = relationships.find(
      (r) => r.target === projectId && r.type === "LEADS"
    );
    if (leadRel) {
      return nodes.find((n) => n.id === leadRel.source);
    }
    return null;
  };

  const getProjectMembers = (projectId) => {
    const memberRels = relationships.filter(
      (r) => r.target === projectId && r.type === "WORKS_ON"
    );
    return memberRels
      .map((rel) => nodes.find((n) => n.id === rel.source))
      .filter(Boolean);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Active Projects
      </h2>

      <div className="grid gap-6">
        {projects.map((project) => {
          const lead = getProjectLead(project.id);
          const members = getProjectMembers(project.id);

          return (
            <div
              key={project.id}
              className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-teal-700 mb-2">
                    {project.name}
                  </h3>

                  {project.properties && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-slate-600">
                          Status:
                        </span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            project.properties.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {project.properties.status}
                        </span>
                      </div>

                      {project.properties.startDate && (
                        <div>
                          <span className="text-sm font-medium text-slate-600">
                            Start Date:
                          </span>
                          <span className="ml-2 text-sm text-slate-700">
                            {project.properties.startDate}
                          </span>
                        </div>
                      )}

                      {project.properties.budget && (
                        <div>
                          <span className="text-sm font-medium text-slate-600">
                            Budget:
                          </span>
                          <span className="ml-2 text-sm text-slate-700">
                            {project.properties.budget}
                          </span>
                        </div>
                      )}

                      {project.properties.technology && (
                        <div>
                          <span className="text-sm font-medium text-slate-600">
                            Technology:
                          </span>
                          <span className="ml-2 text-sm text-slate-700">
                            {project.properties.technology}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {project.properties?.description && (
                    <p className="text-slate-600 mb-4">
                      {project.properties.description}
                    </p>
                  )}
                </div>

                <div className="lg:w-80">
                  {lead && (
                    <div className="mb-4">
                      <h4 className="font-medium text-slate-700 mb-2">
                        Project Lead
                      </h4>
                      <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {lead.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {lead.name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {lead.properties?.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {members.length > 0 && (
                    <div>
                      <h4 className="font-medium text-slate-700 mb-2">
                        Team Members ({members.length})
                      </h4>
                      <div className="space-y-2">
                        {members.slice(0, 3).map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg"
                          >
                            <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-xs">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {member.name}
                              </p>
                              <p className="text-xs text-slate-600">
                                {member.properties?.role}
                              </p>
                            </div>
                          </div>
                        ))}
                        {members.length > 3 && (
                          <p className="text-sm text-slate-500 text-center">
                            +{members.length - 3} more members
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
