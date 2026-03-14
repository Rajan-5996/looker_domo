import domo from "ryuu.js";

export async function createCard(pageId, config) {
  console.log("fetching data from domo");

  const res = await domo.post("/domo/codeengine/v2/packages/createcard", {
    pageId: pageId,
    config
  });

  console.log(res);
}
