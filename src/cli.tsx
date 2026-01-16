import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./App.tsx";

const cli = meow(
  `
	Usage
	  $ cogito

	Options
		--name  Your name

	Examples
	  $ cogito --name=Jane
	  Hello, Jane
`,
  {
    importMeta: import.meta,
    flags: {
      name: {
        type: "string",
      },
    },
  }
);

render(React.createElement(App, cli.flags));
