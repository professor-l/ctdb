import { mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import path from "path";

// recursively load all `.graphql` files
const files = loadFilesSync(
  path.join(__dirname, './*.graphql'),
  { recursive: true }
);

// merge and export
export default mergeTypeDefs(files);