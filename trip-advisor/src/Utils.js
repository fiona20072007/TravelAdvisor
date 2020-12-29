import firebase from "./firebase";
const db = firebase.firestore();

export async function searchLoadOptions(inputValue) {
  return new Promise((resolve) => {
    db.collection("indexCountry")
      .orderBy("name")
      .startAt(inputValue)
      .endAt(inputValue + "\uf8ff")
      .get()
      .then((docs) => {
        if (!docs.empty) {
          let recommendedTags = [];
          docs.forEach(function (doc) {
            const tag = {
              value: doc.id,
              label: doc.data().name,
            };
            recommendedTags.push(tag);
          });
          return resolve(recommendedTags);
        } else {
          return resolve([]);
        }
      });
  });
}

export function setNavbarColor(path) {
  if (window.location.pathname.substring(1, 9) === path) {
    document.querySelector("nav").style.backgroundColor = "white";
    document.querySelector("nav").style.boxShadow =
      "0 0 8px rgba(0, 0, 0, 0.2)";
    document.getElementById("MainTitle").style.color = "rgb(138, 134, 134)";
  }
}

export function setLikeRed(id) {
  document.getElementById(`like-${id}`).style.fill = "rgb(255, 128, 191)";
  document.getElementById(`like-${id}`).style["fill-opacity"] = 1;
}
export function setLikeGray(id) {
  document.getElementById(`like-${id}`).style.fill = "rgb(255, 255, 255)";
  document.getElementById(`like-${id}`).style["fill-opacity"] = 0.3;
}
export function showLike(id) {
  document.getElementById(`like-${id}`).style.display = "block";
}
export function hideLike(id) {
  document.getElementById(`like-${id}`).style.display = "none";
}
export function handleStar(num) {
  return (Number(num) / 5.4) * 100;
}

export function scrollIntoView(id) {
  window.setTimeout(
    () =>
      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      }),
    10
  );
}
