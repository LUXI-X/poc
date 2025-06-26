"use client";

import { useData } from "@/lib/data-context";

export default function EmployeesList() {
  const { data } = useData();
  const { nodes, relationships } = data;

  const employees = nodes.filter((n) => n.type === "Employee");

  const getEmployeeProjects = (employeeId) => {
    const projectRels = relationships.filter(
      (r) =>
        r.source === employeeId && (r.type === "WORKS_ON" || r.type === "LEADS")
    );
    return projectRels
      .map((rel) => ({
        project: nodes.find((n) => n.id === rel.target),
        role: rel.type === "LEADS" ? "Lead" : "Member",
      }))
      .filter((p) => p.project);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Team Members</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => {
          const projects = getEmployeeProjects(employee.id);

          return (
            <div
              key={employee.id}
              className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {employee.name}
                  </h3>
                  <p className="text-teal-600 font-medium">
                    {employee.properties?.role}
                  </p>
                </div>
              </div>

              {employee.properties && (
                <div className="space-y-2 mb-4">
                  {employee.properties.department && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Department:
                      </span>
                      <span className="text-sm text-slate-700">
                        {employee.properties.department}
                      </span>
                    </div>
                  )}

                  {employee.properties.experience && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Experience:
                      </span>
                      <span className="text-sm text-slate-700">
                        {employee.properties.experience} years
                      </span>
                    </div>
                  )}

                  {employee.properties.email && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Email:
                      </span>
                      <span className="text-sm text-slate-700 truncate">
                        {employee.properties.email}
                      </span>
                    </div>
                  )}

                  {employee.properties.skills && (
                    <div>
                      <span className="text-sm font-medium text-slate-600 block mb-1">
                        Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {employee.properties.skills
                          .split(",")
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {projects.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">
                    Current Projects
                  </h4>
                  <div className="space-y-2">
                    {projects.map((projectInfo, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded"
                      >
                        <span className="text-sm text-slate-700">
                          {projectInfo.project.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            projectInfo.role === "Lead"
                              ? "bg-teal-100 text-teal-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {projectInfo.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
