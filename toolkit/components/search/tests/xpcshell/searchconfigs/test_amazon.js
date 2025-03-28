/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const test = new SearchConfigTest({
  identifier: "amazon",
  default: {
    // Not default anywhere.
  },
  available: {
    included: [
      {
        // The main regions we ship Amazon to. Below this are special cases.
        regions: ["us", "jp"],
      },
    ],
  },
  details: [
    {
      domain: "amazon.co.jp",
      telemetryId: "amazon-jp",
      aliases: ["@amazon"],
      included: [
        {
          regions: ["jp"],
        },
      ],
      suggestionUrlBase: "https://completion.amazon.co.jp/search/complete",
      suggestUrlCode: "mkt=6",
    },
    {
      domain: "amazon.com",
      telemetryId: "amazondotcom-us",
      aliases: ["@amazon"],
      included: [
        {
          regions: ["us"],
        },
      ],
      searchUrlCode: "tag=moz-us-20",
    },
  ],
});

add_task(async function setup() {
  // We only need to do setup on one of the tests.
  await test.setup("89.0");
});

add_task(async function test_searchConfig_amazon() {
  await test.run();
});

add_task(async function test_searchConfig_amazon_pre89() {
  const version = "88.0";
  AddonTestUtils.createAppInfo(
    "xpcshell@tests.mozilla.org",
    "XPCShell",
    version,
    version
  );
  // For pre-89, Amazon has a slightly different config.
  let details = test._config.details.find(
    d => d.telemetryId == "amazondotcom-us"
  );
  details.telemetryId = "amazondotcom";
  details.searchUrlCode = "tag=mozilla-20";

  await test.run();
});
