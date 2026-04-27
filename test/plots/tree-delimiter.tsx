import {Plot, TreeMark} from "../../src/react/index.js";

export async function treeDelimiter() {
  return (
    <Plot axis={null} height={150} margin={10} marginLeft={40} marginRight={190}>
      <TreeMark
        data={[
          "foo;a;//example", // foo → a → //example
          "foo;a;//example/1", // foo → a → //example/1
          "foo;b;//example/2", // foo → b → //example/2
          "foo;c\\;c;//example2", // foo → c;c → //example2
          "foo;d\\\\;d;//example2", // foo → d\ → d → //example3
          "foo;d\\\\;\\d;//example2", // foo → d\ → \d → //example3
          "foo;e\\\\\\;e;//example2", // foo → e\;e → //example3
          "foo;f/f;//example4", // foo → f/f → //example4
          "foo;g\\/g;//example3" // foo → g\/g → //example3
        ]}
        delimiter=";"
      />
    </Plot>
  );
}

export async function treeDelimiter2() {
  return (
    <Plot axis={null} height={150} margin={10} marginLeft={40} marginRight={190}>
      <TreeMark
        data={[
          "foo/a/\\/\\/example", // foo → a → //example
          "foo/a/\\/\\/example\\/1", // foo → a → //example/1
          "foo/b/\\/\\/example\\/2", // foo → b → //example/2
          "foo/c;c/\\/\\/example2", // foo → c;c → //example2
          "foo/d\\\\/d/\\/\\/example2", // foo → d\ → d → //example3
          "foo/d\\\\/\\d/\\/\\/example2", // foo → d\ → \d → //example3
          "foo/e\\\\;e/\\/\\/example2", // foo → e\;e → //example3
          "foo/f\\/f/\\/\\/example4", // foo → f/f → //example4
          "foo/g\\\\\\/g/\\/\\/example3" // foo → g\/g → //example3
        ]}
      />
    </Plot>
  );
}
