type SplitTitle = {
  first: string;
  second: string;
};

export function splitWordBalanced(title?: string | null): SplitTitle {
  if (!title || typeof title !== "string") {
    return { first: "", second: "" };
  }

  const words = title
    .trim()
    .split(/\s+/) // handles multiple spaces
    .filter(Boolean);

  if (words.length === 0) {
    return { first: "", second: "" };
  }
  if (words.length === 1) {
    return { first: words[0], second: "" };
  }

  const mid = Math.ceil(words.length / 2);

  return {
    first: words.slice(0, mid).join(" "),
    second: words.slice(mid).join(" "),
  };
}

// export function splitWordBalanced({ title = "Enter Word" }: WordSplitProps) {
//   const words = title.trim().split(" ");
//   const mid = Math.ceil(words.length / 2);

//   return {
//     first: words.slice(0, mid).join(" "),
//     second: words.slice(mid).join(" "),
//   };
// }

export function splitWordFirst(title: string) {
  const words = title.trim().split(" ");

  if (words.length === 1) {
    return { first: words[0], second: "" };
  }

  return {
    first: words.slice(0, -1).join(" "),
    second: words.slice(-1).join(""),
  };
}
