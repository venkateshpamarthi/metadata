const {
  createV1,
  updateV1,
  TokenStandard
} = require("@metaplex-foundation/mpl-token-metadata");
const web3 = require("@solana/web3.js");
const {
  createSignerFromKeypair,
  none,
  percentAmount,
  publicKey,
  signerIdentity,
  some,
} = require("@metaplex-foundation/umi");
const { createUmi } = require("@metaplex-foundation/umi-bundle-defaults");
const {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
} = require("@metaplex-foundation/umi-web3js-adapters");
const bs58 = require("bs58");

const SPL_TOKEN_2022_PROGRAM_ID = publicKey(
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
);

function loadWalletKey(keypairFile) {
  const fs = require("fs");
  const loaded = web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString()))
  );
  return loaded;
}

const INITIALIZE = false;

async function main() {
  console.log("let's name some token-22 tokens in 2024!");
  const myKeypair = loadWalletKey(
    "/Users/venkatesh/Desktop/weFm4XYUVUckbiM5ErKuQsvPqFRJhS2R93gZRbBQA7p.json"
  );
  const mint = new web3.PublicKey(
    "tokikSrhSHdi7c8Z1eQZwBDtNPT5MouoCyT8vU8aicC"
  );

  const umi = createUmi("https://api.devnet.solana.com");
  const signer = createSignerFromKeypair(umi, fromWeb3JsKeypair(myKeypair));
  umi.use(signerIdentity(signer, true));

  const ourMetadata = {
    // TODO change those values!
    name: "VenkyToken Extended",
    symbol: "VT",
    uri: "https://raw.githubusercontent.com/venkateshpamarthi/metadata/main/metadata.json",
  };
  //raw.githubusercontent.com https://raw.githubusercontent.com/venkateshpamarthi/metadata/blob/main/metadata.json
  if (INITIALIZE) {
    const onChainData = {
      ...ourMetadata,
      // we don't need that
      sellerFeeBasisPoints: percentAmount(0, 2),
      creators: none(),
      collection: none(),
      uses: none(),
    };
    const accounts = {
      mint: fromWeb3JsPublicKey(mint),
      splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
    };
    const data = {
      ...onChainData,
      isMutable: true,
      discriminator: 0,
      tokenStandard: TokenStandard.Fungible,
      collectionDetails: none(),
      ruleSet: none(),
      createV1Discriminator: 0,
      primarySaleHappened: true,
      decimals: none(),
      printSupply: none(),
    };
    const txid = await createV1(umi, { ...accounts, ...data }).sendAndConfirm(
      umi
    );
    console.log(bs58.encode(txid.signature));
  } else {
    const onChainData = {
      ...ourMetadata,
      sellerFeeBasisPoints: 0,
      creators: none(),
      collection: none(),
      uses: none(),
    };
    const accounts = {
      mint: fromWeb3JsPublicKey(mint),
    };
    const data = {
      discriminator: 0,
      data: some(onChainData),
      updateV1Discriminator: 0,
    };
    const txid = await updateV1(umi, { ...accounts, ...data }).sendAndConfirm(
      umi
    );
    console.log(bs58.encode(txid.signature));
  }
}

main();
