document.addEventListener("DOMContentLoaded", function () {
  /* script to handle active location link on page load */
  setTimeout(function () {
    var activelocation = document.getElementById("activeLocationLink");
    if (activelocation) {
      activelocation.style.display = "none";
      activelocation.click();
    } else {
      console.log("activelocation not found");
    }
  }, 500);

  // ------------------------------Script for Side nav's Arrow change when collapased and expanded-----------------------

  setTimeout(function () { 
    var panelHeaders = document.querySelectorAll(".tab-menu #setupMenu .collapsible-panel-header");

    panelHeaders.forEach(function (panelHeader) {
        var panelHeaderImg = panelHeader.querySelector(".img");

        if (panelHeaderImg) {

            panelHeader.addEventListener("click", function () {
                panelHeaders.forEach(function (otherHeader) {
                    var otherImg = otherHeader.querySelector(".img");
                    if (otherHeader !== panelHeader && otherImg) {
                        otherImg.classList.remove("panelheaderImage");
                    }
                });

                panelHeaderImg.classList.toggle("panelheaderImage");
                panelHeaderImg.classList.remove("panelheaderImageHover");
            });

            panelHeader.addEventListener("mouseenter", function () {
                if (panelHeaderImg.classList.contains("panelheaderImage")) {
                    panelHeaderImg.classList.add("panelheaderImageHover");
                }
            });

            panelHeader.addEventListener("mouseleave", function () {
                panelHeaderImg.classList.remove("panelheaderImageHover");
            });
        }
    });
}, 500);

  /* --------------------------------------------------script for stepper -----------------------------------------------------------------*/

  // Select all inner div elements within .wfDiagram that have a color attribute
  var colorDivs = document.querySelectorAll(".wfDiagram > div > div[color]");
  var wfDivs = document.querySelectorAll(".wfDiagram > div");

  if (colorDivs.length > 0) {
    // Variables to keep track of the last divs with color "blue" or "green"
    var lastColoredDiv = null;

    // Remove existing classes related to color and visibility
    wfDivs.forEach(function (wfDiv) {
      wfDiv.classList.remove(
        "current-blue",
        "current-green",
        "current-red",
        "after-blue",
        "after-green",
        "after-red",
        "last-visible",
        "before-blue"
      );
    });

    // Iterate over each div to update classes and find the last colored div
    colorDivs.forEach(function (innerDiv) {
      var parentDiv = innerDiv.parentElement;
      var color = innerDiv.getAttribute("color");

      // Assign classes based on color
      if (color === "blue") {
        parentDiv.classList.add("before-blue");
        lastColoredDiv = parentDiv; // Update the last colored div
      } else if (color === "green") {
        // If we encounter a green div, the previous blue divs are no longer current
        if (lastColoredDiv) {
          lastColoredDiv.classList.remove("current-blue");
          lastColoredDiv.classList.add("before-blue");
        }
        parentDiv.classList.add("current-green");
        lastColoredDiv = parentDiv; // Update the last colored div
      }
    });

    // Assign the after-blue class to elements after the last colored div
    var foundLastColoredDiv = false;
    wfDivs.forEach(function (wfDiv) {
      if (foundLastColoredDiv) {
        // Do not add after-blue if the last colored div is green
        if (!lastColoredDiv.classList.contains("current-green")) {
          wfDiv.classList.add("after-blue");
        }
      }
      if (wfDiv === lastColoredDiv) {
        foundLastColoredDiv = true; // Start assigning after-blue after the last colored div
      }
    });

    // Find the last visible div and add the last-visible class
    var lastVisibleDiv = Array.from(wfDivs)
      .reverse()
      .find(function (div) {
        return window.getComputedStyle(div).display !== "none";
      });

    if (lastVisibleDiv) {
      lastVisibleDiv.classList.add("last-visible");
    }
  }
  if (colorDivs.length === 0) {
    var wfDivs = document.querySelectorAll(".wfDiagram > div");
    var foundSelected = false; // Flag to indicate when a selected color is found
    var lastVisibleDiv = null; // Track the last visible div

    // First, remove any existing classes
    wfDivs.forEach(function (wfDiv) {
      wfDiv.classList.remove(
        "before-blue",
        "current-blue",
        "current-red",
        "current-green",
        "after-blue",
        "last-visible"
      );
    });
    // Iterate over each div to assign classes based on the 'selected' attribute and visibility
    wfDivs.forEach(function (wfDiv) {
      var innerDiv = wfDiv.querySelector("div");
      var selectedAttr = innerDiv.getAttribute("selected");
      var isDisplayed = window.getComputedStyle(wfDiv).display !== "none";

      // Update the last visible div
      if (isDisplayed) {
        lastVisibleDiv = wfDiv;
      }

      // Apply classes based on whether a selected color is found
      if (!foundSelected && isDisplayed) {
        if (
          selectedAttr === "blue" ||
          selectedAttr === "red" ||
          selectedAttr === "green" ||
          selectedAttr === "Green"
        ) {
          foundSelected = selectedAttr; // Set the flag with the found color
          wfDiv.classList.add("current-" + selectedAttr.toLowerCase());
        } else {
          wfDiv.classList.add("before-blue");
        }
      } else if (isDisplayed) {
        wfDiv.classList.add("after-blue");
      }
    });

    // Assign the last-visible class to the last visible div
    if (lastVisibleDiv) {
      lastVisibleDiv.classList.add("last-visible");
    }

    // If no selected color is found, remove after-blue and apply before-blue
    if (!foundSelected) {
      wfDivs.forEach(function (wfDiv) {
        wfDiv.classList.remove("before-blue");
        wfDiv.classList.add("after-blue");
      });
    }
  }

  // Center the active element if one is found
  var activeElement = document.querySelector(
    ".wfDiagram > div.current-blue, .wfDiagram > div.current-green, .wfDiagram > div.current-red"
  );

  if (activeElement) {
    centerActiveElement(activeElement);
  } else if (lastVisibleDiv) {
    // If no active element is found, center the last visible element
    centerActiveElement(lastVisibleDiv);
  }

  function centerActiveElement(activeElement) {
    var scrollContainer = document.querySelector(".wfDiagram");
    var activeElementRect = activeElement.getBoundingClientRect();
    var scrollContainerRect = scrollContainer.getBoundingClientRect();
    var centerPosition =
      activeElementRect.left -
      scrollContainerRect.left +
      activeElementRect.width / 2 -
      scrollContainer.clientWidth / 2;

    scrollContainer.scrollLeft = centerPosition;
  }

  var wfDiagram = document.querySelector(".wfDiagram");

  function updateJustifyContent() {
    var dialogBox = document.querySelector(
      ".ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable.ui-resizable"
    );

    if (!dialogBox) {
      wfDiagram?.classList.add("no-overflow");
    }
    if (wfDiagram?.scrollWidth > wfDiagram?.clientWidth) {
      wfDiagram?.classList.remove("no-overflow");
    }
  }

  updateJustifyContent();

  window.addEventListener("resize", updateJustifyContent);
  var openDialogButton = document.querySelector(".systemLink.openInPopup");
  openDialogButton?.addEventListener("click", updateJustifyContent);

  // Callback function to execute when mutations are observed
  var callback = function (mutationsList, observer) {
    for (var mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(function (addedNode) {
          // Dor example, you can check if it's an element node
          if (addedNode.nodeType === Node.ELEMENT_NODE) {
            if (addedNode.classList.contains("ui-dialog")) {
              updateJustifyContent();
            }
          }
        });
      }
    }
  };

  var observer = new MutationObserver(callback);

  var config = { attributes: false, childList: true, subtree: false };

  observer.observe(document.body, config);

  /* --------------------------------------------------script for stepper ends here----------------------------------------------------------*/

  // script to handle severity style
  var severityDivs = document.querySelectorAll(".severity");
  severityDivs.forEach(function (severityDiv) {
    if (severityDiv.innerText.toLowerCase() === "low") {
      severityDiv.classList.add("severity-low");
    } else if (severityDiv.innerText.toLowerCase() === "moderate") {
      severityDiv.classList.add("severity-moderate");
    } else if (severityDiv.innerText.toLowerCase() === "severe") {
      severityDiv.classList.add("severity-severe");
    }
  });

  // script to handle Audit management risk level
  var prettyCellRiskLevel = document.querySelectorAll(".prettyCell");
  prettyCellRiskLevel.forEach(function (prettyDiv) {
    if (prettyDiv.innerText.toLowerCase() === "low") {
      prettyDiv.classList.add("severity");
      prettyDiv.classList.add("severity-low");
    } else if (prettyDiv.innerText.toLowerCase() === "medium") {
      prettyDiv.classList.add("severity");
      prettyDiv.classList.add("severity-moderate");
    } else if (prettyDiv.innerText.toLowerCase() === "high") {
      prettyDiv.classList.add("severity");
      prettyDiv.classList.add("severity-severe");
    }
  });

  // script to handle Monitoring devices status
  var prettyCellDeployed = document.querySelectorAll(".prettyCell");
  prettyCellDeployed.forEach(function (prettyDiv) {
    if (prettyDiv.innerText.toLowerCase() === "checked-in") {
      prettyDiv.classList.add("severity");
      prettyDiv.classList.add("severity-low");
      prettyDiv.style.setProperty("width", "155px", "important");
    } else if (prettyDiv.innerText.toLowerCase() === "checked-out") {
      prettyDiv.classList.add("severity");
      prettyDiv.classList.add("severity-severe");
      prettyDiv.style.setProperty("width", "155px", "important");
    } else if (prettyDiv.innerText.toLowerCase() === "unavailable") {
      prettyDiv.classList.add("severity");
      prettyDiv.style.backgroundColor = "#F0F0F0";
      prettyDiv.style.border = "2px solid #464646";
      prettyDiv.style.setProperty("color", "#464646", "important");
      prettyDiv.style.setProperty("width", "155px", "important");
    }
  });

  var actionLinks = document.querySelectorAll(".actionlLink");
  actionLinks.forEach(function (actionLink) {
    var computedStyle = window.getComputedStyle(actionLink);
    if (computedStyle.visibility === "hidden") {
      actionLink.style.setProperty("display", "none", "important");
    }
  });

  var executeActionLinks = document.querySelectorAll(
    ".systemLink.gridExecuteActionLink"
  );
  executeActionLinks.forEach(function (actionLink) {
    if (actionLink.innerText.length === 0) {
      actionLink.style.setProperty("border", "none", "important");
    }
  });

  // script to handle system-link secondary button style
  window.addEventListener("load", function () {
    const systemLinks = document.querySelectorAll("a.systemLink");
    systemLinks.forEach((link) => {
      const style = window.getComputedStyle(link);
      const background = style.getPropertyValue("background");
      if (!background.includes("url(")) {
        link.style.setProperty("padding-left", "16px", "important");
      }
    });
  });

  // script to handle wf-link secondary button style
  window.addEventListener("load", function () {
    const wfLinks = document.querySelectorAll("a.wf-link");
    wfLinks.forEach((link) => {
      const style = window.getComputedStyle(link);
      const background = style.getPropertyValue("background");
      if (!background.includes("url(")) {
        link.style.setProperty("padding-left", "16px", "important");
      }
    });
  });

  // script to handle system-link secondary button style in affecting certain cells in the grid hence this script to resolve it
  window.addEventListener("load", function () {
    const inventoryDataCell = document.querySelectorAll(".inventory-row td.data-cell a");
    inventoryDataCell.forEach((cell) => {
        cell.style.setProperty("padding-left", "0px", "important");
    });
  });

  // To add placeholder to input field of Advanced search
  var filterInputPlaceholder = document.querySelector(
    ".filter-container .header .name input"
  );
  if (filterInputPlaceholder) {
    filterInputPlaceholder.placeholder = "Enter the name of the filter";
  }

  // To remove default value for Input field in Advanced search
  var filterInputValue = document.querySelector(
    ".filter-container .header .name input"
  );
  if (filterInputValue) {
    filterInputValue.value = "";
  }

  // Changing the text from Hide message to Clear in grid notification
  var clearText = document.querySelector(
    ".grid_container .grid-notification-wrapper .right"
  );
  if (clearText) {
    clearText.childNodes[2].nodeValue = " Close";
  }

  // Setting flex to grid notification wrapper for responsiveness
  var wrapper = document.querySelector(
    ".grid_container .grid-notification-wrapper"
  );

  if (wrapper) {
    // Create a MutationObserver instance
    var observer = new MutationObserver(function (mutationsList) {
      mutationsList.forEach(function (mutation) {
        if (
          mutation.type === "attributes" &&
          wrapper.style.display === "block"
        ) {
          wrapper.style.setProperty("display", "flex", "important"); // Update to flex
          observer.disconnect(); // Stop observing after the change
        }
      });
    });

    // Start observing the wrapper for attribute changes
    observer.observe(wrapper, {
      attributes: true, // Observe attribute changes
      attributeFilter: ["style"], // Only listen to `style` changes
    });
  }

  // Advance input field related styles
  setTimeout(function () {
    var parent = document.querySelector(
      ".filterbuilder .footer .predicate-expression"
    );

    if (parent) {
      parent.classList.remove("edit");
      parent.addEventListener("click", function () {
        var input = parent.querySelector("input");

        if (
          input.value.trim().length > 0 &&
          !parent.classList.contains("edit")
        ) {
          parent.classList.add("edit");
          input.classList.add("predicateInput");
        } else if (
          input.value.trim().length == 0 &&
          input.classList.contains("predicateInput")
        ) {
          parent.classList.remove("edit");
          input.classList.remove("predicateInput");
        }
      });
    }
  }, 500);

  /* script for application tabs */

  setTimeout(function () {
    /* i) for adding left and right arrows to tabs in mobile view */
    var tabsContainer = document.querySelector(".app-tabs");
    var tabsList = document.querySelector(".app-tabs ul");
    var tabs = tabsList?.querySelectorAll("li");
    // Create left arrow button
    var leftArrow = document.createElement("button");
    leftArrow.classList.add("scroll-arrow", "left-arrow");
    tabsContainer.insertBefore(leftArrow, tabsContainer.firstChild); // Insert before the ul

    // Create right arrow button
    var rightArrow = document.createElement("button");
    rightArrow.classList.add("scroll-arrow", "right-arrow");
    tabsContainer.appendChild(rightArrow); // Insert after the ul

    // Function to update arrow visibility based on overflow
    function updateArrowVisibility() {
      var hasOverflow = tabsList.scrollWidth > tabsList.clientWidth;
      leftArrow.style.display = hasOverflow ? "block" : "none";
      rightArrow.style.display = hasOverflow ? "block" : "none";
    }

    // Call the function initially to set the correct display state for the arrows
    updateArrowVisibility();

    // Add a resize event listener to check for overflow when the window is resized
    window.addEventListener("resize", updateArrowVisibility);

    /* ii) for adding event to arrows */

    leftArrow.addEventListener("click", function () {
      // Calculate the width of the visible area of the tabs container
      var visibleAreaWidth = tabsList.clientWidth;

      // Scroll to the left by the width of the visible area, or to the start
      var newScrollPosition = tabsList.scrollLeft - visibleAreaWidth;
      tabsList.scrollLeft = newScrollPosition >= 0 ? newScrollPosition : 0;
    });

    rightArrow.addEventListener("click", function () {
      var visibleAreaWidth = tabsList.clientWidth;
      var maxScrollLeft = tabsList.scrollWidth - visibleAreaWidth;

      // Scroll to the right by the width of the visible area, or to the maximum scroll position
      var newScrollPosition = tabsList.scrollLeft + visibleAreaWidth;
      tabsList.scrollLeft =
        newScrollPosition <= maxScrollLeft ? newScrollPosition : maxScrollLeft;
    });

    /*iii) move extra tabs to app-tabs li */
    var tabsContainer = document.querySelector(".app-tabs");
    var tabsList = tabsContainer.querySelector("ul");
    var tabsListItems = tabsList?.querySelectorAll("li");
    var moreButton = document.querySelector("#more-button");
    var extraTabs = moreButton?.querySelector(".extra-tabs");
    var extraTabsItems = extraTabs?.querySelectorAll("li");
    var currentPageUrl = window.location.href; // Get the current page URL

    // Function to move extra tabs items to the main list or back to the dropdown
    function moveExtraTabsItems(hasOverflow) {
      var currentActiveTabId = document.querySelector(
        ".tabs-overflow .selected-tab a"
      )?.id;

      if (hasOverflow) {
        extraTabsItems?.forEach(function (item) {
          tabsList.appendChild(item);
        });

        if (moreButton) {
          moreButton.parentNode?.removeChild(moreButton);
        }

        // if selected-tab is not in extra tabs
        tabsListItems.forEach(function (item) {
          var itemLink = item.querySelector("a");
          if (currentPageUrl.includes(itemLink.href)) {
            item.classList.add("selected-tab");
          }
        });

        if (currentActiveTabId) {
          var activeTab = document
            .getElementById(currentActiveTabId)
            ?.closest("li");
          if (activeTab) {
            // Remove the class from all tabs
            document
              .querySelectorAll(".tabs-overflow li")
              .forEach(function (tab) {
                tab.classList.remove("selected-tab");
              });
            // Add the class to the active tab
            activeTab.classList.add("selected-tab");
          }
        }
      }
    }

    // Function to check for overflow and move items accordingly
    function checkAndMoveTabs() {
      var hasOverflow = tabsList.scrollWidth > tabsList.clientWidth;
      if (hasOverflow) {
        tabsList.classList.add("tabs-overflow");
      } else {
        tabsList.classList.remove("tabs-overflow");
      }
      moveExtraTabsItems(hasOverflow);
    }

    checkAndMoveTabs();

    // Check for overflow and move items on window resize
    window.addEventListener("resize", checkAndMoveTabs);

    /* iv) for showing active element in center on page load */

    var activeTab = document.querySelector(".app-tabs .selected-tab");

    // setTimeout(function () {
    if (activeTab) {
      // Ensure the activeTab is not hidden by any parent's overflow
      activeTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
    // }, 100);
  }, 500);

  /** -----------------------------script for upload template button iframe --------------------*/
  function loadFontIntoIframe(iframeDoc, fontUrl) {
    var link = iframeDoc.createElement("link");
    link.href = fontUrl;
    link.rel = "stylesheet";
    iframeDoc.head.appendChild(link);
  }
  function applyStyles(element, styles) {
    Object.assign(element.style, styles);
  }

  // Function to apply styles to the iframe content
  function styleIframeContent(iframe) {
    try {
      var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      loadFontIntoIframe(
        iframeDoc,
        "https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap",
        "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
      );

      var formUpload = iframeDoc.querySelector("#formUpload");
      if (formUpload) {
        applyStyles(formUpload, {
          display: "flex",
          justifyContent: "space-between",
        });
      }

      var inputs = iframeDoc.querySelectorAll("input");

      var fileInput = iframeDoc.querySelector("input[type='file']");
      if (fileInput) {
        // Hide the actual file input
        applyStyles(fileInput, {
          opacity: "0",
          position: "absolute",
          zIndex: "-1",
          width: "0.1px",
          height: "0.1px",
          overflow: "hidden",
        });

        // Create a label element that will be styled
        var fileInputLabel = iframeDoc.createElement("label");
        fileInputLabel.htmlFor = fileInput.id; // Ensure this matches the file input's id
        fileInputLabel.innerHTML = "Choose File...";

        applyStyles(fileInputLabel, {
          display: "flex",
          padding: "8px 16px",
          alignItems: "center",
          gap: "2px",
          border: "2px solid #004C8F",
          borderRadius: "100px",
          color: "#004C8F",
          backgroundColor: "#EEF6FB",
          fontFamily: "Poppins",
          fontSize: "12px",
          fontStyle: "normal",
          fontWeight: "500",
          lineHeight: "16px",
          letterSpacing: "0.46px",
        });

        // Insert the label right after the file input
        fileInput.parentNode.insertBefore(
          fileInputLabel,
          fileInput.nextSibling
        );

        // Create a text span for "No File Chosen"
        var fileInfoSpan = iframeDoc.createElement("span");
        fileInfoSpan.textContent = "No File Chosen";
        applyStyles(fileInfoSpan, {
          display: "inline-block",
          position: "absolute",
          left: "125px",
          top: "10px",
          color: "var(--ILXmono-black, #262626)",
          fontFamily: "Open Sans",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: "400",
          lineHeight: "18px",
          letterSpacing: "0.15px"
        });

        // Insert the fileInfoText span after the label
        fileInputLabel.parentNode.insertBefore(
          fileInfoSpan,
          fileInputLabel.nextSibling
        );

        // Update the fileInfoSpan whenever a file is selected
        fileInput.addEventListener("change", function () {
          var fileName =
            fileInput.files && fileInput.files.length > 0
              ? fileInput.files[0].name
              : "No file chosen";
          fileInfoSpan.textContent = fileName;
        });

        var mediaQueryList = window.matchMedia("(max-width: 540px)");
 
        function handleMediaChange(e) {
          if (e.matches) {
            formUpload.style.flexDirection = "column";
            fileInputLabel.style.marginBottom = "10px";
            fileInputLabel.style.width = "fit-content";
            fileInfoSpan.style.width = "135px";
            fileInfoSpan.style.overflow = "hidden";
            fileInfoSpan.style.textOverflow = "ellipsis";
            fileInfoSpan.style.position = "unset";
            fileInfoSpan.style.display = "unset";
            fileInfoSpan.style.marginBottom = "10px";
            fileInfoSpan.style.marginLeft = "5px";
          } else {
            formUpload.style.flexDirection = "row";
            fileInfoSpan.style.position = "absolute";
            fileInfoSpan.style.display = "inline-block";
            fileInfoSpan.style.marginBottom = "unset";
            fileInfoSpan.style.marginLeft = "unset";
          }
        }

        mediaQueryList.addListener(handleMediaChange);
        handleMediaChange(mediaQueryList);
      }
      if (inputs.length > 0) {
        inputs.forEach(function (input) {
          applyStyles(input, {
            backgroundColor: "#004C8F",
            borderRadius: "100px",
            display: "flex",
            height: "36px",
            padding: "8px 16px",
            alignItems: "center",
            gap: "2px",
            color: "var(--ILXwhite, #FEFEFE)",
            fontFamily: "Poppins",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: "16px",
            letterSpacing: "0.46px",
            maxWidth: "122px",
            border: "unset",
          });
        });
      } else {
        setTimeout(function () {
          styleIframeContent(iframe);
        }, 100);
      }
    } catch (e) {
      console.error("Error accessing iframe contents:", e);
    }
  }

  // Function to attach load event and apply styles
  function attachIframeLoadHandler(iframe) {
    iframe.onload = function () {
      styleIframeContent(iframe);
    };
    // Apply styles immediately if the iframe document is already loaded
    if (iframe.contentDocument.readyState === "complete") {
      styleIframeContent(iframe);
    }
  }

  // Event listener for the "Upload Template" button
  var uploadTemplateButton = document.querySelector(".gridUploadMergeLink");
  if (uploadTemplateButton) {
    uploadTemplateButton.addEventListener("click", function () {
      // Delay attaching the load event to handle dynamic content loading
      setTimeout(function () {
        var iframe = document.getElementById("frameUpload");
        if (iframe) {
          // Set up the MutationObserver
          var observer = new MutationObserver(callback);
          var config = { childList: true, subtree: true };
          observer.observe(
            document.querySelector(
              "#MailMergeFragmentGridSection_gridsection_container .links"
            ),
            config
          );
          attachIframeLoadHandler(iframe);
        }
      }, 500);
    });
  }

  // MutationObserver callback
  var callback = function (mutationsList) {
    for (var mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(function (addedNode) {
          if (
            addedNode.nodeType === Node.ELEMENT_NODE &&
            addedNode.id === "frameUpload"
          ) {
            attachIframeLoadHandler(addedNode);
          }
        });
      }
    }
  };
});
