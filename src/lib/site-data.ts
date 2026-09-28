export const navItems = [
  { label: "Home", to: "/" }, { label: "About", to: "/about" },
  { label: "Leadership", to: "/leadership" }, { label: "Media Development", to: "/media-development" },
  { label: "Youth Empowerment", to: "/youth-empowerment" }, { label: "Projects", to: "/projects" },
  { label: "Impact", to: "/impact" }, { label: "Insights", to: "/insights" },
  { label: "Gallery", to: "/gallery" }, { label: "Contact", to: "/contact" },
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
