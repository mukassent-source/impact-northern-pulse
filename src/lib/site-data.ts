export const navItems = [
  { label: "Home", to: "/", hash: "top" }, { label: "About", to: "/", hash: "about" },
  { label: "Leadership", to: "/", hash: "leadership" }, { label: "Media Development", to: "/", hash: "media-development" },
  { label: "Youth Empowerment", to: "/", hash: "youth-empowerment" }, { label: "Projects", to: "/", hash: "projects" },
  { label: "Impact", to: "/", hash: "impact" }, { label: "Insights", to: "/", hash: "insights" },
  { label: "Gallery", to: "/", hash: "gallery" }, { label: "Contact", to: "/", hash: "contact" },
] as const;
export const areas = [
  ["Strategic Media Development", "Developing media initiatives, communication strategies and platforms that improve information access and engagement."],
  ["Youth Empowerment", "Supporting young people through skills development, opportunities, mentorship and leadership initiatives."],
  ["Community Engagement", "Building stronger relationships between organizations, communities and stakeholders."],
  ["Leadership & Strategy", "Designing initiatives that align people, resources and communication toward measurable objectives."],
  ["Digital Innovation", "Exploring technology and digital platforms as tools for communication, learning and development."],
  ["Social Impact", "Supporting initiatives designed to create sustainable value for communities and young people."],
] as const;
export const projectExamples = [
  {title:"Youth Leadership Initiative", category:"Youth", description:"A space for a verified youth leadership initiative and its outcomes."},
  {title:"Community Media Development Program", category:"Media", description:"A space for a verified community media program and its outcomes."},
  {title:"Digital Skills & Innovation Initiative", category:"Digital", description:"A space for a verified digital learning initiative and its outcomes."},
  {title:"Northern Ghana Media Engagement", category:"Community", description:"A space for a verified media engagement project and its outcomes."},
] as const;
