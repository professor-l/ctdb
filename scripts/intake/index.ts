import { init } from "./orgList";
import { parseCSV } from "./sheetParser";
import { addToDatabase } from "./databaseInput";

// Using global variables isn't best practice, but that's what I've done!
function main(){
  const orgs = init();
  const organizations = parseCSV(orgs);
  addToDatabase(organizations);
}

main();
