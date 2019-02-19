App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    dnaCollectItem: 0,
    dna: 0,
    dnaFetchItem: 0,
    dnaProducer: 0,
    dnaDistributor: 0,
    dnaManufacturer: 0,
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originProducerID: "0x0000000000000000000000000000000000000000",
    originProducerName: null,
    originProducerInformation: null,
    originProducerLatitude: null,
    originProducerLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",
    roleAddressAccount: "0x0000000000000000000000000000000000000000",
    jsonSupplyChainBuildPath: "",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.dnaCollectItem = $("#dnaCollectItem").val();
        App.dnaFetchItem = $("#dnaFetchItem").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originProducerID = $("#originProducerID").val();
        App.originProducerName = $("#originProducerName").val();
        App.originProducerInformation = $("#originProducerInformation").val();
        App.originProducerLatitude = $("#originProducerLatitude").val();
        App.originProducerLongitude = $("#originProducerLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();
        App.roleAddressAccount = $("#roleAccountAddress").val();

        console.log(
            App.sku,
            App.dnaCollectItem,
            App.dnaFetchItem,
            App.upc,
            App.ownerID, 
            App.originProducerID, 
            App.originProducerName, 
            App.originProducerInformation, 
            App.originProducerLatitude, 
            App.originProducerLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID,
            App.roleAddressAccount
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
                if(App.isGanacheLocalNetwork()) {
                    console.log('Connected to Ganache Local Network via metamask');
                    App.jsonSupplyChainBuildPath = "../../build/contracts/SupplyChain.json";
                } else {
                    console.log('Connected to Rinkeby');
                    App.jsonSupplyChainBuildPath = "../../build-rinkeby/contracts/SupplyChain.json";
                }
            } catch (error) {
                // User denied account access...
                console.error("User denied account access");
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            console.log('Connected to Ganache Local Network via Web3 direct instance');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getAccountsID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    isGanacheLocalNetwork: async function () {
        web3 = new Web3(App.web3Provider);
        await web3.version.getNetwork(function(err, netId) {
            if (err) {
                console.log('Error checking network:',err);
                return;
            }
            console.log('netID:',netId);
            if(netId != 4) {
                //console.log('Ganache network');
                return true;
            } else {
                //console.log('Rinkeby network');
                return false;
            }
        })
    },

    initSupplyChain: async function () {
        /// Source the truffle compiled smart contracts
        console.log(App.jsonSupplyChainBuildPath);
        /// JSONfy the smart contracts
        $.getJSON(App.jsonSupplyChainBuildPath, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            //App.fetchItemBufferOne();
            //App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.addRoleToSupplyChainContract(event);
                //return await App.harvestItem(event);
                break;
            case 2:
                return await App.collectMetallItem(event);
                //return await App.processItem(event);
                break;
            case 3:
                return await App.fetchItemBufferPublic(event);
                break;
            case 4:
                return await App.processMetalItem(event);
                break;
            case 5:
                return await App.packItem(event);
                break;
            case 6:
                return await App.sellItemToDistributor(event);
                break;
            case 7:
                return await App.buyItemDistributor(event);
                break;
            case 8:
                return await App.shipItemToDistributor(event);
                break;
            case 9:
                return await App.receivedItemDistributor(event);
                break;
            case 10:
                return await App.purchaseItemDistributor(event);
                break;
            case 11:
                return await App.sellItemToManufacturer(event);
                break;
            case 12:
                return await App.buyItemManufacturer(event);
                break;
            case 13:
                return await App.shipItemToManufacturer(event);
                break;
            case 14:
                return await App.receiveItemManufacturer(event);
                break;
            case 15:
                return await App.purchaseItemManufacturer(event);
                break;
            }
    },

    // Function to get the owner address
    getOwner: (event) => {
        event.preventDefault();
        const processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.owner.call();
          }).then(function(result) {
            console.log('Owner Address:', result);
          }).catch(function(err) {
            console.log(err.message);
          });
    },

    // Function to add new alloy producer/distributor/manufacturer to the SupplyChain contract. Only the owner
    // of the contract can add new addresses to the contract
    addRoleToSupplyChainContract: async (event) => {
        event.preventDefault();
        const processId = parseInt($(event.target).data('id'));
        const roleSelected = $("#rolesSelectBox option").filter(":selected").val();
        // Read the form values
        App.readForm();
        await App.getMetaskAccountID();
        //await App.getOwner(event);
        console.log('Selected role: ' + roleSelected + ' | address: ' + App.roleAddressAccount + ' | metamaskAccount: ' + App.metamaskAccountID);

        if (roleSelected == 'alloy-producer') {
            App.contracts.SupplyChain.deployed().then(function(instance) {
                return instance.addAluminumProducer(App.roleAddressAccount, {from: App.metamaskAccountID});
            }).then(function(result) {
                $("#ftc-item").text(result);
                console.log('Added alloy producer role to SupplyChain Contract',result);
            }).catch(function(err) {
                console.log(err.message);
            });
        } else if (roleSelected == 'distributor') {
            App.contracts.SupplyChain.deployed().then(function(instance) {
                return instance.addDistributor(App.roleAddressAccount, {from: App.metamaskAccountID});
            }).then(function(result) {
                $("#ftc-item").text(result);
                console.log('Added distributor role to SupplyChain Contract',result);
            }).catch(function(err) {
                console.log(err.message);
            });
        } else {
            App.contracts.SupplyChain.deployed().then(function(instance) {
                return instance.addAutoManufacturer(App.roleAddressAccount, {from: App.metamaskAccountID});
            }).then(function(result) {
                $("#ftc-item").text(result);
                console.log('Added auto manufacturer role to SupplyChain Contract',result);
            }).catch(function(err) {
                console.log(err.message);
            });
        }
    },

    // Function to collect metal. At this point the alloy producer will add an asset item to the SupplyChain contract
    collectMetallItem: async (event) => {
        event.preventDefault();
        // Read the form values
        App.readForm();
        await App.getMetaskAccountID();

        //$('.custom-file-label').file_upload();
        
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.collectItem(
                App.dnaCollectItem, 
                App.metamaskAccountID, 
                App.originProducerName, 
                App.originProducerInformation, 
                App.originProducerLatitude, 
                App.originProducerLongitude, 
                App.productNotes,
                {from: App.metamaskAccountID}
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('harvestItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    // Function to fetch data
    fetchItemBufferPublic: (event) => {
        ///   event.preventDefault();
        ///    var processId = parseInt($(event.target).data('id'));
        App.dna = $('#dnaFetchItem').val();
        console.log('DNA',App.dna);
        // Hide the alert in case open
        $('#fetch-data-not-found').hide();
    
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.fetchItemBufferPublic(App.dna, {from: App.metamaskAccountID});
        }).then(function(result) {
            // Display table with data
            document.getElementById('result-dna').innerText = result[0];
            document.getElementById('result-sku').innerText = result[1];
            document.getElementById('result-owner-id').innerText = result[2];
            document.getElementById('result-producer-id').innerText = result[3];
            document.getElementById('result-producer-name').innerText = result[4];
            document.getElementById('result-item-state').innerText = App.helperMappingStateCodeToString(result[8]);
            document.getElementById('result-price').innerText = web3.fromWei(result[9], 'ether');
            document.getElementById('result-distributor-id').innerText = result[10];
            $('#search-table').show();
            $('#search-table').fadeIn();
            $('#search-table').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('fetchItemBufferPublic', result);
        }).catch(function(err) {
            console.log(err.message);
            $('#search-table').hide();
            $('#fetch-data-not-found').show();
            $('#fetch-data-not-found').fadeIn();
            $('#fetch-data-not-found').slideDown();
        });
    },

    // Function to process metal. Only Producer can process items
    processMetalItem: async (event) => {
        event.preventDefault();
        // Read the form values
        App.dna = $('#dnaProducerChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-producer-error').hide();
        $('#alert-producer-success').hide();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.processItem(App.dna, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-producer-success").text("Item processed");
            $('#alert-producer-success').show();
            $('#alert-producer-success').fadeIn();
            $('#alert-producer-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Process metal', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-producer-error").text("Error by process item. Please contact the administrator.");
            $('#alert-producer-error').show();
            $('#alert-producer-error').fadeIn();
            $('#alert-producer-error').slideDown();
        });
    },

    // Function to pack alloy. Only Producer can pack alloy
    packItem: async (event) => {
        event.preventDefault();
        // Read the form values
        App.dna = $('#dnaProducerChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-producer-error').hide();
        $('#alert-producer-success').hide();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packItem(App.dna, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-producer-success").text("Item packed");
            $('#alert-producer-success').show();
            $('#alert-producer-success').fadeIn();
            $('#alert-producer-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Pack item', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-producer-error").text("Error by pack item. Please contact the administrator.");
            $('#alert-producer-error').show();
            $('#alert-producer-error').fadeIn();
            $('#alert-producer-error').slideDown();
        });
    },

    // Function to sell alloy. Only Producer can sell alloy to distributor
    sellItemToDistributor: async (event) => {
        event.preventDefault();
        // Read the form values
        App.dna = $('#dnaProducerChangeState').val();
        App.productPrice = $('#priceProducer').val();
        const price= web3.toWei(App.productPrice, "ether");
        //console.log('Price: ', price);
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-producer-error').hide();
        $('#alert-producer-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.sellItemToDistributor(App.dna, price, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-producer-success").text("Item ready to sell for distributor");
            $('#alert-producer-success').show();
            $('#alert-producer-success').fadeIn();
            $('#alert-producer-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to distributor', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-producer-error").text("Error by sell item. Please contact the administrator.");
            $('#alert-producer-error').show();
            $('#alert-producer-error').fadeIn();
            $('#alert-producer-error').slideDown();
        });
    },

    // Function to buy alloy. Only Distributor can buy alloy from producer
    buyItemDistributor: async (event) => {
        event.preventDefault();
        // Read the form values
        App.dna = $('#dnaDistributorChangeState').val();
        App.productPrice = $('#priceDistributor').val();
        const price= web3.toWei(App.productPrice, "ether");
        //console.log('Price: ', price);
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-distributor-error').hide();
        $('#alert-distributor-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.buyItemDistributor(App.dna, {from: App.metamaskAccountID, value: price});
        }).then(function(result) {
            $("#alert-distributor-success").text("Item successfully sold");
            $('#alert-distributor-success').show();
            $('#alert-distributor-success').fadeIn();
            $('#alert-distributor-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to distributor', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-distributor-error").text("Error by buying item. Please contact the administrator.");
            $('#alert-distributor-error').show();
            $('#alert-distributor-error').fadeIn();
            $('#alert-distributor-error').slideDown();
        });
    },

    // Function to ship alloy. Only Producer can pack alloy
    shipItemToDistributor: async (event) => {
        event.preventDefault();
        // Read the form values
        App.dna = $('#dnaProducerChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-producer-error').hide();
        $('#alert-producer-success').hide();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItemDistributor(App.dna, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-producer-success").text("Item shipped");
            $('#alert-producer-success').show();
            $('#alert-producer-success').fadeIn();
            $('#alert-producer-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Ship item', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-producer-error").text("Error by ship item. Please contact the administrator.");
            $('#alert-producer-error').show();
            $('#alert-producer-error').fadeIn();
            $('#alert-producer-error').slideDown();
        });
    },

    // Function to receive alloy. Only Distributor can receive alloy from producer
    receivedItemDistributor: async (event) => {
        event.preventDefault();
        // Read the form values
        App.dna = $('#dnaDistributorChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-distributor-error').hide();
        $('#alert-distributor-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItemDistributor(App.dna, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-distributor-success").text("Item successfully received");
            $('#alert-distributor-success').show();
            $('#alert-distributor-success').fadeIn();
            $('#alert-distributor-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to distributor', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-distributor-error").text("Error by receiving item. Please contact the administrator.");
            $('#alert-distributor-error').show();
            $('#alert-distributor-error').fadeIn();
            $('#alert-distributor-error').slideDown();
        });
    },

    // Function to purchase alloy. Only Distributor can purchase alloy from producer
    purchaseItemDistributor: async (event) => {
        event.preventDefault();
        // Read the form values
        App.dna = $('#dnaDistributorChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-distributor-error').hide();
        $('#alert-distributor-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseItemDistributor(App.dna, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-distributor-success").text("Item successfully purchased");
            $('#alert-distributor-success').show();
            $('#alert-distributor-success').fadeIn();
            $('#alert-distributor-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to distributor', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-distributor-error").text("Error by purchasing item. Please contact the administrator.");
            $('#alert-distributor-error').show();
            $('#alert-distributor-error').fadeIn();
            $('#alert-distributor-error').slideDown();
        });
    },

    // Function to sell alloy to manufacturer. Only Distributor can sell alloy to manufacturer
    sellItemToManufacturer: async (event) => {
        event.preventDefault();
        // Read the form values
        App.dna = $('#dnaDistributorChangeState').val();
        App.productPrice = $('#priceDistributor').val();
        const price= web3.toWei(App.productPrice, "ether");
        //console.log('Price: ', price);
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-distributor-error').hide();
        $('#alert-distributor-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.sellItemToManufacturer(App.dna, price, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-distributor-success").text("Item ready for sell");
            $('#alert-distributor-success').show();
            $('#alert-distributor-success').fadeIn();
            $('#alert-distributor-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to distributor', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-distributor-error").text("Error by selling item. Please contact the administrator.");
            $('#alert-distributor-error').show();
            $('#alert-distributor-error').fadeIn();
            $('#alert-distributor-error').slideDown();
        });
    },
    
    // Function to ship alloy to manufacturer. Only Distributor can ship alloy to manufacturer
    shipItemToManufacturer: async (event) => {
        event.preventDefault();
        // Read the form values
        App.dna = $('#dnaDistributorChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-distributor-error').hide();
        $('#alert-distributor-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItemManufacturer(App.dna, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert-distributor-success").text("Item successfully shipped");
            $('#alert-distributor-success').show();
            $('#alert-distributor-success').fadeIn();
            $('#alert-distributor-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to distributor', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-distributor-error").text("Error by shipping item. Please contact the administrator.");
            $('#alert-distributor-error').show();
            $('#alert-distributor-error').fadeIn();
            $('#alert-distributor-error').slideDown();
        });
    },

    // Function to buy alloy from distributor. Only Manufacturer can buy alloy from distributor
    buyItemManufacturer: async (event) => {
        event.preventDefault();
        // Read the form values
        App.dna = $('#dnaManufacturerChangeState').val();
        App.productPrice = $('#priceManufacturer').val();
        const price= web3.toWei(App.productPrice, "ether");
        //console.log('Price: ', price);
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-manufacturer-error').hide();
        $('#alert alert-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.buyItemManufacturer(App.dna, {from: App.metamaskAccountID, value: price});
        }).then(function(result) {
            $("#alert alert-success").text("Item successfully sold");
            $('#alert alert-success').show();
            $('#alert alert-success').fadeIn();
            $('#alert alert-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to distributor', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-manufacturer-error").text("Error by buying item. Please contact the administrator.");
            $('#alert-manufacturer-error').show();
            $('#alert-manufacturer-error').fadeIn();
            $('#alert-manufacturer-error').slideDown();
        });
    },

    // Function to receive alloy. Only Manufacturer can receive alloy from distributor
    receiveItemManufacturer: async (event) => {
        event.preventDefault();
        // Read the form values
        App.dna = $('#dnaManufacturerChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-manufacturer-error').hide();
        $('#alert alert-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItemManufacturer(App.dna, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert alert-success").text("Item successfully received");
            $('#alert alert-success').show();
            $('#alert alert-success').fadeIn();
            $('#alert alert-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to distributor', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-manufacturer-error").text("Error by receiving item. Please contact the administrator.");
            $('#alert-manufacturer-error').show();
            $('#alert-manufacturer-error').fadeIn();
            $('#alert-manufacturer-error').slideDown();
        });
    },

    // Function to purchase alloy. Only Manufacturer can purchase alloy from distributor
    purchaseItemManufacturer: async (event) => {
        event.preventDefault();
        // Read the form values
        App.dna = $('#dnaManufacturerChangeState').val();
        await App.getMetaskAccountID();
        // Hide the alert in case open
        $('#alert-manufacturer-error').hide();
        $('#alert alert-success').hide();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseItemManufacturer(App.dna, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#alert alert-success").text("Item successfully purchased");
            $('#alert alert-success').show();
            $('#alert alert-success').fadeIn();
            $('#alert alert-success').slideDown();
            // Add result to history
            $("#ftc-item").text(result);
            console.log('Sell item to distributor', result);
        }).catch(function(err) {
            console.log(err.message);
            $("#alert-manufacturer-error").text("Error by purchasing item. Please contact the administrator.");
            $('#alert-manufacturer-error').show();
            $('#alert-manufacturer-error').fadeIn();
            $('#alert-manufacturer-error').slideDown();
        });
    },

    helperMappingStateCodeToString: (stateCode) => {
        console.log(stateCode.c[0]);
        let stateString = '';
        if (stateCode.c[0] == 0) {
            stateString = 'Collected';
        } else if (stateCode.c[0] == 1) {
            stateString = 'Processed';
        } else if (stateCode.c[0] == 2) {
            stateString = 'Packed';
        } else if (stateCode.c[0] == 3) {
            stateString = 'Ready for sale to distributor';
        } else if (stateCode.c[0] == 4) {
            stateString = 'Sold to distributor';
        } else if (stateCode.c[0] == 5) {
            stateString = 'Shipped to distributor';
        } else if (stateCode.c[0] == 6) {
            stateString = 'Alloy received at distributor';
        } else if (stateCode.c[0] == 7) {
            stateString = 'Alloy purchased by distributor';
        } else if (stateCode.c[0] == 8) {
            stateString = 'Ready for sale to manufacturer';
        } else if (stateCode.c[0] == 9) {
            stateString = 'Sold to manufacturer';
        } else if (stateCode.c[0] == 10) {
            stateString = 'Shipped to manufacturer';
        } else if (stateCode.c[0] == 11) {
            stateString = 'Alloy received at manufacturer';
        } else if (stateCode.c[0] == 12) {
            stateString = 'Alloy purchased by manufacturer';
        }
        return stateString;
    },
    /*
    harvestItem: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.harvestItem(
                App.upc, 
                App.metamaskAccountID, 
                App.originFarmName, 
                App.originFarmInformation, 
                App.originFarmLatitude, 
                App.originFarmLongitude, 
                App.productNotes
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('harvestItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    processItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.processItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('processItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    packItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('packItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei(1, "ether");
            console.log('productPrice',productPrice);
            return instance.sellItem(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");
            return instance.buyItem(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    shipItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('shipItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },
    */

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log('Error in fetch events:', err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
/*
$( ".custom-select" ).change(function() {
    alert( "Handler for .change() called." );
});*/
