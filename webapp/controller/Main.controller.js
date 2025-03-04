sap.ui.define(["ui5/challenge/controller/BaseController", "ui5/challenge/plugins/xrpl/xrpl-latest"], function (BaseController, Xrpl) {
  "use strict";

  return BaseController.extend("ui5.challenge.controller.Main", {
    onInit: function () {
      this.readXRPL();
    },
    readXRPL: async function () {
      const PUBLIC_SERVER = "wss://xrplcluster.com/";
      const client = new xrpl.Client(PUBLIC_SERVER);
      await client.connect();
      client
        .request({
          id: 420,
          command: "ledger_data",
          ledger_index: "current",
          limit: 50,
        })
        .then(
          function (response) {
            const result = response.result.state.filter((xrplData) => {
              // We only want to see Accounts in the List
              return xrplData.Account !== undefined;
            });
            const xrplModel = this.getOwnerComponent().getModel("xrpl");
            xrplModel.setProperty("/LedgerData", result);
          }.bind(this)
        );
    },
    onLoadXrplData: function (event) {
      this.readXRPL();
    },
    navToDetails: function (event) {
      this.navTo("Detail");
    },
  });
});
