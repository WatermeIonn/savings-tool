export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Dan's Super Amazing Savings Tool",
	description: "Use this to help you save!",
	navItems: [
		{
			label: "Tool",
			href: "/",
		},
		{
			label: "Settings",
			href: "/settings",
		},
	],
};
