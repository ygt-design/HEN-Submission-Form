const auth = "M44wKBrGObHhPXntyOHfdIjjjwMXZj0K8X4OrYtUDi0";
const imgurClientID = "f1c06fbf189968a";

const predefinedTags = [
  "Maker",
  "Writer",
  "Designer",
  "Programmer",
  "Artist",
  "Archivist",
  "Archive",
  "Hemispheric Encounters",
  "Scholar",
  "HEN",
  "Queer",
  "Feminist",
  "Performance Art",
  "Activism",
  "Performer",
  "Stylist",
];

document.addEventListener("DOMContentLoaded", async function () {
  const tagsContainer = document.getElementById("tagsContainer");
  const loadingScreen = document.getElementById("loadingScreen");
  const content = document.getElementById("content");

  try {
    console.log("Fetching user channels...");
    const channelsResponse = await fetch(
      "https://api.are.na/v2/users/hen-archives/channels",
      {
        headers: {
          Authorization: "Bearer " + auth,
        },
      }
    );

    if (!channelsResponse.ok) {
      throw new Error("Failed to fetch channels");
    }

    const channelsData = await channelsResponse.json();
    const channels = channelsData.channels;

    console.log("Fetched channels:", channels);

    const tagsSet = new Set(predefinedTags);

    for (const channel of channels) {
      console.log(`Fetching blocks for channel ${channel.id}...`);
      const blocksResponse = await fetch(
        `https://api.are.na/v2/channels/${channel.id}/contents`,
        {
          headers: {
            Authorization: "Bearer " + auth,
          },
        }
      );

      if (!blocksResponse.ok) {
        console.warn(`Failed to fetch blocks for channel ${channel.id}`);
        continue;
      }

      const blocksData = await blocksResponse.json();
      const tagBlocks = blocksData.contents.filter(
        (block) => block.title.toLowerCase() === "tag"
      );

      console.log(`Fetched blocks for channel ${channel.id}:`, tagBlocks);

      tagBlocks.forEach((block) => {
        block.content.split(",").forEach((tag) => tagsSet.add(tag.trim()));
      });
    }

    const tags = Array.from(tagsSet).sort();

    console.log("Fetched tags:", tags);

    tags.forEach((tag) => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "tags";
      checkbox.value = tag;

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(tag));
      tagsContainer.appendChild(label);
      tagsContainer.appendChild(document.createElement("br"));
    });

    console.log("Tags added to UI.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loadingScreen.style.display = "none";
    content.style.display = "block";
  }
});

document
  .getElementById("channelForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const location = document.getElementById("location").value.trim();
    const url = document.getElementById("url").value.trim();
    const hero = document.getElementById("hero").files[0];
    const selectedTags = Array.from(
      document.querySelectorAll("input[name='tags']:checked")
    ).map((tag) => tag.value);
    const customTag = document.getElementById("customTag").value.trim();

    if (customTag) {
      selectedTags.push(customTag);
    }

    if (!name || !description) {
      alert("Please fill in all fields.");
      return;
    }

    const feedback = document.getElementById("feedback");
    feedback.textContent = "Creating channel...";

    try {
      // Create the channel
      const createChannelResponse = await fetch(
        "https://api.are.na/v2/channels",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth,
          },
          body: JSON.stringify({
            title: name,
            status: "closed",
          }),
        }
      );

      if (!createChannelResponse.ok) {
        const errorText = await createChannelResponse.text();
        throw new Error(`Error creating channel: ${errorText}`);
      }

      const channelData = await createChannelResponse.json();
      const channelId = channelData.id;
      console.log("Channel created:", channelId);

      // Add description block with title "Description"
      const addDescriptionBlockResponse = await fetch(
        `https://api.are.na/v2/channels/${channelId}/blocks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth,
          },
          body: JSON.stringify({
            content: description,
            title: "Description",
          }),
        }
      );

      if (!addDescriptionBlockResponse.ok) {
        const errorText = await addDescriptionBlockResponse.text();
        throw new Error(`Error adding description block: ${errorText}`);
      }

      console.log("Description block added.");

      // Add tags block
      const tagsContent = selectedTags.join(", ");
      const addTagsBlockResponse = await fetch(
        `https://api.are.na/v2/channels/${channelId}/blocks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth,
          },
          body: JSON.stringify({
            content: tagsContent,
            title: "Tag",
          }),
        }
      );

      if (!addTagsBlockResponse.ok) {
        const errorText = await addTagsBlockResponse.text();
        throw new Error(`Error adding tags block: ${errorText}`);
      }

      console.log("Tags block added.");

      // Add location block
      if (location) {
        const addLocationBlockResponse = await fetch(
          `https://api.are.na/v2/channels/${channelId}/blocks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth,
            },
            body: JSON.stringify({
              content: location,
              title: "Place",
            }),
          }
        );

        if (!addLocationBlockResponse.ok) {
          const errorText = await addLocationBlockResponse.text();
          throw new Error(`Error adding location block: ${errorText}`);
        }

        console.log("Location block added.");
      }

      // Add URL block
      if (url) {
        const urlPattern =
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (!urlPattern.test(url)) {
          throw new Error("Invalid URL format");
        }

        const addUrlBlockResponse = await fetch(
          `https://api.are.na/v2/channels/${channelId}/blocks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth,
            },
            body: JSON.stringify({
              content: url,
              title: "URL",
            }),
          }
        );

        if (!addUrlBlockResponse.ok) {
          const errorText = await addUrlBlockResponse.text();
          throw new Error(`Error adding URL block: ${errorText}`);
        }

        console.log("URL block added.");
      }

      // Upload Hero Image to Imgur and add block
      if (hero) {
        const formData = new FormData();
        formData.append("image", hero);

        const imgurResponse = await fetch("https://api.imgur.com/3/image", {
          method: "POST",
          headers: {
            Authorization: "Client-ID " + imgurClientID,
          },
          body: formData,
        });

        if (!imgurResponse.ok) {
          const errorText = await imgurResponse.text();
          throw new Error(`Error uploading hero image to Imgur: ${errorText}`);
        }

        const imgurData = await imgurResponse.json();
        const heroImageUrl = imgurData.data.link;

        const addHeroImageBlockResponse = await fetch(
          `https://api.are.na/v2/channels/${channelId}/blocks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth,
            },
            body: JSON.stringify({
              source: heroImageUrl,
              title: "Hero",
            }),
          }
        );

        if (!addHeroImageBlockResponse.ok) {
          const errorText = await addHeroImageBlockResponse.text();
          throw new Error(`Error adding hero image block: ${errorText}`);
        }

        console.log("Hero image block added.");
      }

      feedback.textContent = "Channel created successfully!";
    } catch (error) {
      feedback.textContent = "Error creating channel: " + error.message;
      console.error("Error:", error);
    }
  });
