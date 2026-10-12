# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression/editor-files.spec.js >> Editor images - upload failures, undo and limits >> TC0067 - undo AFTER the in-flight upload finished while the image was deleted still restores a usable image
- Location: tests/regression/editor-files.spec.js:137:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-editor="rich"] .ProseMirror').getByRole('img')
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('[data-editor="rich"] .ProseMirror').getByRole('img') with timeout 20000ms
  - waiting for locator('[data-editor="rich"] .ProseMirror').getByRole('img')

```

```yaml
- button "Cambiar de espacio de trabajo":
  - text: E Espacio de dzottola Propietario
  - img
- list:
  - listitem:
    - button "Buscar ⌘K":
      - img
      - text: Buscar ⌘K
  - listitem:
    - button "Nueva página":
      - img
      - text: Nueva página
- navigation "Páginas":
  - group:
    - listitem:
      - link "qa-auto-mv18pii9-riw5":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/bebbbeaf-d5fe-43e2-8caf-287a6fb0d7db
      - button "Agregar subpágina en qa-auto-mv18pii9-riw5":
        - img
      - button "Acciones de qa-auto-mv18pii9-riw5":
        - img
    - listitem:
      - link "qa-auto-mv18pipz-cf0x":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/3a596de4-b500-4c3c-bcce-af322296b04c
      - button "Agregar subpágina en qa-auto-mv18pipz-cf0x":
        - img
      - button "Acciones de qa-auto-mv18pipz-cf0x":
        - img
    - listitem:
      - button "Expandir qa-auto-mv18pjtn-dct2":
        - img
      - link "qa-auto-mv18pjtn-dct2":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/3220ad90-5999-490c-b799-af8dadcb5340
      - button "Agregar subpágina en qa-auto-mv18pjtn-dct2":
        - img
      - button "Acciones de qa-auto-mv18pjtn-dct2":
        - img
    - listitem:
      - link "qa-auto-mv18pn2v-o47b":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/202c5207-3963-4397-b146-037c1058df01
      - button "Agregar subpágina en qa-auto-mv18pn2v-o47b":
        - img
      - button "Acciones de qa-auto-mv18pn2v-o47b":
        - img
    - listitem:
      - link "qa-auto-mv18pnnj-ygjy":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/3641f9f7-4b57-4c4f-8cd6-8bacea4be93c
      - button "Agregar subpágina en qa-auto-mv18pnnj-ygjy":
        - img
      - button "Acciones de qa-auto-mv18pnnj-ygjy":
        - img
    - listitem:
      - link "qa-auto-mv18puuu-soj3":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/7ac4e8a4-8881-4808-9811-c89e37f29868
      - button "Agregar subpágina en qa-auto-mv18puuu-soj3":
        - img
      - button "Acciones de qa-auto-mv18puuu-soj3":
        - img
    - listitem:
      - link "qa-auto-mv18qbyi-ujt2":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/a42a9bc2-edc9-4848-9246-81a79b7a82b8
      - button "Agregar subpágina en qa-auto-mv18qbyi-ujt2":
        - img
      - button "Acciones de qa-auto-mv18qbyi-ujt2":
        - img
    - listitem:
      - link "qa-auto-mv18qrhz-2xy4":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/9548f034-e82c-4cc8-8789-10eec348af7e
      - button "Agregar subpágina en qa-auto-mv18qrhz-2xy4":
        - img
      - button "Acciones de qa-auto-mv18qrhz-2xy4":
        - img
    - listitem:
      - link "qa-auto-mv18rbkc-olkd":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/622f3836-46b2-43cb-957a-89b1809b36f8
      - button "Agregar subpágina en qa-auto-mv18rbkc-olkd":
        - img
      - button "Acciones de qa-auto-mv18rbkc-olkd":
        - img
    - listitem:
      - link "qa-auto-mv18rbmo-3s0f":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/2eece30e-34b4-48ca-b710-97888de310dc
      - button "Agregar subpágina en qa-auto-mv18rbmo-3s0f":
        - img
      - button "Acciones de qa-auto-mv18rbmo-3s0f":
        - img
    - listitem:
      - button "Expandir qa-auto-mv18rd12-lryq":
        - img
      - link "qa-auto-mv18rd12-lryq":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/bca4f52e-0f74-4d1b-9ce6-4ef174d1aec5
      - button "Agregar subpágina en qa-auto-mv18rd12-lryq":
        - img
      - button "Acciones de qa-auto-mv18rd12-lryq":
        - img
    - listitem:
      - link "qa-auto-mv18rfp3-2osc":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/cc368616-d6c9-4547-8130-7dee4ab17379
      - button "Agregar subpágina en qa-auto-mv18rfp3-2osc":
        - img
      - button "Acciones de qa-auto-mv18rfp3-2osc":
        - img
    - listitem:
      - link "qa-auto-mv18rgj8-ku6f":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/2a1c4662-9871-4143-854a-fe7138e4869b
      - button "Agregar subpágina en qa-auto-mv18rgj8-ku6f":
        - img
      - button "Acciones de qa-auto-mv18rgj8-ku6f":
        - img
    - listitem:
      - link "qa-auto-mv18ru10-bvv0":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/4565fdb2-32d6-41c9-a543-e37cdc46b1d8
      - button "Agregar subpágina en qa-auto-mv18ru10-bvv0":
        - img
      - button "Acciones de qa-auto-mv18ru10-bvv0":
        - img
    - listitem:
      - link "qa-auto-mv18s7cg-chhc":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/f2c97f18-f322-4bfa-ae5a-a04d6a4b0192
      - button "Agregar subpágina en qa-auto-mv18s7cg-chhc":
        - img
      - button "Acciones de qa-auto-mv18s7cg-chhc":
        - img
    - listitem:
      - link "qa-auto-mv18sjw4-vrr3":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/6a0875ff-924e-4264-8f3f-51568bd890ca
      - button "Agregar subpágina en qa-auto-mv18sjw4-vrr3":
        - img
      - button "Acciones de qa-auto-mv18sjw4-vrr3":
        - img
    - listitem:
      - link "qa-auto-mv18tb4p-qidp":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/c46e5e76-68a6-4e62-933e-967955a31be2
      - button "Agregar subpágina en qa-auto-mv18tb4p-qidp":
        - img
      - button "Acciones de qa-auto-mv18tb4p-qidp":
        - img
    - listitem:
      - link "qa-auto-mv18tb9n-eq8f":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/e42eb81d-3287-472e-8e1f-9d14f19b129c
      - button "Agregar subpágina en qa-auto-mv18tb9n-eq8f":
        - img
      - button "Acciones de qa-auto-mv18tb9n-eq8f":
        - img
    - listitem:
      - button "Expandir qa-auto-mv18td3u-0eyu":
        - img
      - link "qa-auto-mv18td3u-0eyu":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/a1afbfac-cc98-4a4d-9d47-ef78ad8ac2ed
      - button "Agregar subpágina en qa-auto-mv18td3u-0eyu":
        - img
      - button "Acciones de qa-auto-mv18td3u-0eyu":
        - img
    - listitem:
      - link "qa-auto-mv18tf7d-xiod":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/fbdd2553-b7ec-4cc6-a230-e6b3a318d614
      - button "Agregar subpágina en qa-auto-mv18tf7d-xiod":
        - img
      - button "Acciones de qa-auto-mv18tf7d-xiod":
        - img
    - listitem:
      - link "qa-auto-mv18ti1a-m3w6":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/71c34487-0b0c-4dc7-9a88-ed0c111263de
      - button "Agregar subpágina en qa-auto-mv18ti1a-m3w6":
        - img
      - button "Acciones de qa-auto-mv18ti1a-m3w6":
        - img
    - listitem:
      - link "qa-auto-mv18tx35-580n":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/2f62b2fb-d7bb-4d36-8f54-716ad266c449
      - button "Agregar subpágina en qa-auto-mv18tx35-580n":
        - img
      - button "Acciones de qa-auto-mv18tx35-580n":
        - img
    - listitem:
      - link "qa-auto-mv18ugj2-9e7l":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/449c99c0-5b73-44ee-bd79-761bbdfaed98
      - button "Agregar subpágina en qa-auto-mv18ugj2-9e7l":
        - img
      - button "Acciones de qa-auto-mv18ugj2-9e7l":
        - img
    - listitem:
      - link "qa-auto-mv18uwk6-ig82":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/32fcece1-e232-442f-a61a-caafb4743ca6
      - button "Agregar subpágina en qa-auto-mv18uwk6-ig82":
        - img
      - button "Acciones de qa-auto-mv18uwk6-ig82":
        - img
    - listitem:
      - link "qa-auto-mv18vhbm-vdp6":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/995e3e9e-0e24-4777-9d7f-7592d9fc1a9c
      - button "Agregar subpágina en qa-auto-mv18vhbm-vdp6":
        - img
      - button "Acciones de qa-auto-mv18vhbm-vdp6":
        - img
    - listitem:
      - link "qa-auto-mv18vhex-ae3b":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/da3d0f5f-5b4f-417c-aed1-7b46fb1071e8
      - button "Agregar subpágina en qa-auto-mv18vhex-ae3b":
        - img
      - button "Acciones de qa-auto-mv18vhex-ae3b":
        - img
    - listitem:
      - button "Expandir qa-auto-mv18vjai-ipyk":
        - img
      - link "qa-auto-mv18vjai-ipyk":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/66fc21eb-cc95-4716-92d8-eb8be4905637
      - button "Agregar subpágina en qa-auto-mv18vjai-ipyk":
        - img
      - button "Acciones de qa-auto-mv18vjai-ipyk":
        - img
    - listitem:
      - link "qa-auto-mv18vm67-b3rm":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/f96a6a9a-fffb-4300-9c56-e7aee69c9cb6
      - button "Agregar subpágina en qa-auto-mv18vm67-b3rm":
        - img
      - button "Acciones de qa-auto-mv18vm67-b3rm":
        - img
    - listitem:
      - link "qa-auto-mv18vmkk-7nhy":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/93c37b85-a309-4cc7-9014-e0f2b858ebb2
      - button "Agregar subpágina en qa-auto-mv18vmkk-7nhy":
        - img
      - button "Acciones de qa-auto-mv18vmkk-7nhy":
        - img
    - listitem:
      - link "qa-auto-mv18w7bo-g37z":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/8d4835c6-5a8f-42d4-ae61-641273d9677f
      - button "Agregar subpágina en qa-auto-mv18w7bo-g37z":
        - img
      - button "Acciones de qa-auto-mv18w7bo-g37z":
        - img
    - listitem:
      - link "qa-auto-mv19ns71-lqor":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/68fe087e-ab6a-4f90-8b76-38989a064987
      - button "Agregar subpágina en qa-auto-mv19ns71-lqor":
        - img
      - button "Acciones de qa-auto-mv19ns71-lqor":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/a74626d7-2fd5-4204-ac50-44d5a577e590
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv1lsdz7-frdj":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/ae74b063-4c8b-4024-8014-ae1a98de1b4b
      - button "Agregar subpágina en qa-auto-mv1lsdz7-frdj":
        - img
      - button "Acciones de qa-auto-mv1lsdz7-frdj":
        - img
    - listitem:
      - link "qa-auto-mv1lse07-jcx9":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/10427d5b-7d80-4d39-ae2b-204326aa8c70
      - button "Agregar subpágina en qa-auto-mv1lse07-jcx9":
        - img
      - button "Acciones de qa-auto-mv1lse07-jcx9":
        - img
    - listitem:
      - link "qa-auto-mv1lsebe-o95g":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/a35036dc-e5d2-4cab-b998-f473a73b86bd
      - button "Agregar subpágina en qa-auto-mv1lsebe-o95g":
        - img
      - button "Acciones de qa-auto-mv1lsebe-o95g":
        - img
    - listitem:
      - link "qa-auto-mv1lshat-tvo4":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/dc4c538b-95ad-4e96-b2e7-8132cc4a0906
      - button "Agregar subpágina en qa-auto-mv1lshat-tvo4":
        - img
      - button "Acciones de qa-auto-mv1lshat-tvo4":
        - img
    - listitem:
      - link "qa-auto-mv1lshe1-36tt":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/4d58a797-5c3a-446c-a5d7-ece213d4f9d4
      - button "Agregar subpágina en qa-auto-mv1lshe1-36tt":
        - img
      - button "Acciones de qa-auto-mv1lshe1-36tt":
        - img
    - listitem:
      - link "qa-auto-mv1lshes-pe3m":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/761854fc-a4e0-4096-8a6e-626673dc15a0
      - button "Agregar subpágina en qa-auto-mv1lshes-pe3m":
        - img
      - button "Acciones de qa-auto-mv1lshes-pe3m":
        - img
    - listitem:
      - link "qa-auto-mv1lskcc-fd7a":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/8983826b-d724-45ef-811c-6e7a06b9fefe
      - button "Agregar subpágina en qa-auto-mv1lskcc-fd7a":
        - img
      - button "Acciones de qa-auto-mv1lskcc-fd7a":
        - img
    - listitem:
      - link "qa-auto-mv1lsl31-nvr1":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/89e5fbc4-4c78-4c79-a15d-7b6b8ec3c732
      - button "Agregar subpágina en qa-auto-mv1lsl31-nvr1":
        - img
      - button "Acciones de qa-auto-mv1lsl31-nvr1":
        - img
    - listitem:
      - link "qa-auto-mv1lsmxh-7n5u":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/c07d48da-bf26-424d-9a7b-aaf0a9cf60fa
      - button "Agregar subpágina en qa-auto-mv1lsmxh-7n5u":
        - img
      - button "Acciones de qa-auto-mv1lsmxh-7n5u":
        - img
    - listitem:
      - link "qa-auto-mv1lsr1x-n7ci":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/f58048f6-51ed-451c-b7b8-64189edaf86d
      - button "Agregar subpágina en qa-auto-mv1lsr1x-n7ci":
        - img
      - button "Acciones de qa-auto-mv1lsr1x-n7ci":
        - img
    - listitem:
      - link "qa-auto-mv1lswup-u0d6":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/5155ea14-4d87-4c2c-bf89-3bc8c0648033
      - button "Agregar subpágina en qa-auto-mv1lswup-u0d6":
        - img
      - button "Acciones de qa-auto-mv1lswup-u0d6":
        - img
    - listitem:
      - link "qa-auto-mv1lt1bw-wlah":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/2819761b-7e21-4651-a207-535901950723
      - button "Agregar subpágina en qa-auto-mv1lt1bw-wlah":
        - img
      - button "Acciones de qa-auto-mv1lt1bw-wlah":
        - img
    - listitem:
      - link "qa-auto-mv1lt1t2-kj3j":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/444c8c5e-c4d7-4085-a430-3e1d44170794
      - button "Agregar subpágina en qa-auto-mv1lt1t2-kj3j":
        - img
      - button "Acciones de qa-auto-mv1lt1t2-kj3j":
        - img
    - listitem:
      - link "qa-auto-mv1lt780-2p8o":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/6d311864-a5c7-4530-846c-2e7a763ed44f
      - button "Agregar subpágina en qa-auto-mv1lt780-2p8o":
        - img
      - button "Acciones de qa-auto-mv1lt780-2p8o":
        - img
    - listitem:
      - link "qa-auto-mv1lt7a2-x5iw":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/d6e2db10-282f-4e03-a322-32736d5c1c7b
      - button "Agregar subpágina en qa-auto-mv1lt7a2-x5iw":
        - img
      - button "Acciones de qa-auto-mv1lt7a2-x5iw":
        - img
    - listitem:
      - link "qa-auto-mv1lt8xd-ru5e":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/16e52254-8367-4d5d-a782-980f63b0f0e1
      - button "Agregar subpágina en qa-auto-mv1lt8xd-ru5e":
        - img
      - button "Acciones de qa-auto-mv1lt8xd-ru5e":
        - img
    - listitem:
      - link "qa-auto-mv1ltaeq-gc24":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/d3101a18-dff8-4a1a-96f3-bc6fb054d86c
      - button "Agregar subpágina en qa-auto-mv1ltaeq-gc24":
        - img
      - button "Acciones de qa-auto-mv1ltaeq-gc24":
        - img
    - listitem:
      - link "qa-auto-mv1ltapo-yxuj":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/6f58f154-d0a0-45f4-bd3a-fb4b6543b366
      - button "Agregar subpágina en qa-auto-mv1ltapo-yxuj":
        - img
      - button "Acciones de qa-auto-mv1ltapo-yxuj":
        - img
    - listitem:
      - link "qa-auto-mv1ltbre-sm0d":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/e4731b88-8911-4ed8-aaa9-a22a83376dde
      - button "Agregar subpágina en qa-auto-mv1ltbre-sm0d":
        - img
      - button "Acciones de qa-auto-mv1ltbre-sm0d":
        - img
    - listitem:
      - link "qa-auto-mv1ltd56-0f2m":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/40fc5bfe-3aeb-4cc3-a4e1-f17e232fc80f
      - button "Agregar subpágina en qa-auto-mv1ltd56-0f2m":
        - img
      - button "Acciones de qa-auto-mv1ltd56-0f2m":
        - img
    - listitem:
      - link "qa-auto-mv1ltdx0-0voh":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/bab66fc6-0fdc-4b61-83ed-41736e8737f8
      - button "Agregar subpágina en qa-auto-mv1ltdx0-0voh":
        - img
      - button "Acciones de qa-auto-mv1ltdx0-0voh":
        - img
    - listitem:
      - link "qa-auto-mv1ltfdp-cv28":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/8e7b419a-b0ac-484f-aacb-8b0d97709318
      - button "Agregar subpágina en qa-auto-mv1ltfdp-cv28":
        - img
      - button "Acciones de qa-auto-mv1ltfdp-cv28":
        - img
    - listitem:
      - link "qa-auto-mv1lthgy-bbj0":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/436b828b-b301-42b4-bfa2-5d95bdde1243
      - button "Agregar subpágina en qa-auto-mv1lthgy-bbj0":
        - img
      - button "Acciones de qa-auto-mv1lthgy-bbj0":
        - img
    - listitem:
      - link "qa-auto-mv1lthwg-pavj":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/7e2367b3-d0e9-4620-8af4-2a636da21241
      - button "Agregar subpágina en qa-auto-mv1lthwg-pavj":
        - img
      - button "Acciones de qa-auto-mv1lthwg-pavj":
        - img
    - listitem:
      - link "qa-auto-mv1ltkya-wazs":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/82e8dbfb-b47d-4d29-be83-a509c26ebcd3
      - button "Agregar subpágina en qa-auto-mv1ltkya-wazs":
        - img
      - button "Acciones de qa-auto-mv1ltkya-wazs":
        - img
    - listitem:
      - link "qa-auto-mv1ltm9g-y0lm":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/f84908d8-ce48-4a71-ac16-92f368914953
      - button "Agregar subpágina en qa-auto-mv1ltm9g-y0lm":
        - img
      - button "Acciones de qa-auto-mv1ltm9g-y0lm":
        - img
    - listitem:
      - link "qa-auto-mv1ltmgb-6k2m":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/c58e7b50-74a5-49a0-b37a-bac0a9273ca4
      - button "Agregar subpágina en qa-auto-mv1ltmgb-6k2m":
        - img
      - button "Acciones de qa-auto-mv1ltmgb-6k2m":
        - img
    - listitem:
      - link "qa-auto-mv1ltnnz-y1wp":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/a61b9d37-5f15-485b-86ce-de3f1330dee3
      - button "Agregar subpágina en qa-auto-mv1ltnnz-y1wp":
        - img
      - button "Acciones de qa-auto-mv1ltnnz-y1wp":
        - img
    - listitem:
      - link "qa-auto-mv1ltqok-vtc5":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/f127bdca-850f-4c63-b9e1-1caf5bd910ea
      - button "Agregar subpágina en qa-auto-mv1ltqok-vtc5":
        - img
      - button "Acciones de qa-auto-mv1ltqok-vtc5":
        - img
    - listitem:
      - link "qa-auto-mv1ltrh8-b4yw":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/baa73045-9c58-464a-ac85-efff7527ec7b
      - button "Agregar subpágina en qa-auto-mv1ltrh8-b4yw":
        - img
      - button "Acciones de qa-auto-mv1ltrh8-b4yw":
        - img
    - listitem:
      - link "qa-auto-mv1lu4o4-6vw1":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/b734e25e-346e-4a71-9c56-33a294bc8281
      - button "Agregar subpágina en qa-auto-mv1lu4o4-6vw1":
        - img
      - button "Acciones de qa-auto-mv1lu4o4-6vw1":
        - img
    - listitem:
      - link "qa-auto-mv1lukp8-s5r6":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/fa6a2764-b522-45a6-88dc-50c408bb53a7
      - button "Agregar subpágina en qa-auto-mv1lukp8-s5r6":
        - img
      - button "Acciones de qa-auto-mv1lukp8-s5r6":
        - img
    - listitem:
      - link "qa-auto-mv1lukp8-a5kd":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/01d673bb-e96e-48a6-ae5c-c99ecf908b05
      - button "Agregar subpágina en qa-auto-mv1lukp8-a5kd":
        - img
      - button "Acciones de qa-auto-mv1lukp8-a5kd":
        - img
    - listitem:
      - link "qa-auto-mv1lukyn-5x3c":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/bb771fe1-9cb4-45f6-a9be-c6295e51dc2f
      - button "Agregar subpágina en qa-auto-mv1lukyn-5x3c":
        - img
      - button "Acciones de qa-auto-mv1lukyn-5x3c":
        - img
    - listitem:
      - link "qa-auto-mv1lusco-6pai":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/5d1fb12c-870f-466a-88f1-1e926f58d983
      - button "Agregar subpágina en qa-auto-mv1lusco-6pai":
        - img
      - button "Acciones de qa-auto-mv1lusco-6pai":
        - img
    - listitem:
      - link "qa-auto-mv1lusvv-2g0d":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/7a8612f6-94a1-400a-b8e0-353cf3b23c07
      - button "Agregar subpágina en qa-auto-mv1lusvv-2g0d":
        - img
      - button "Acciones de qa-auto-mv1lusvv-2g0d":
        - img
    - listitem:
      - link "qa-auto-mv1lusw7-dj2d":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/79eafda2-a889-4366-a825-fc139ab5ba8f
      - button "Agregar subpágina en qa-auto-mv1lusw7-dj2d":
        - img
      - button "Acciones de qa-auto-mv1lusw7-dj2d":
        - img
    - listitem:
      - link "qa-auto-mv1luzs5-fk1z":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/c44e431d-cf4e-4a88-ab37-e4de5798a5f3
      - button "Agregar subpágina en qa-auto-mv1luzs5-fk1z":
        - img
      - button "Acciones de qa-auto-mv1luzs5-fk1z":
        - img
    - listitem:
      - link "qa-auto-mv1lv0ep-6jnr":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/520c45c1-5c9f-47e1-8f45-6c64214f8797
      - button "Agregar subpágina en qa-auto-mv1lv0ep-6jnr":
        - img
      - button "Acciones de qa-auto-mv1lv0ep-6jnr":
        - img
    - listitem:
      - link "qa-auto-mv1lv191-sxin":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/d46c0ba5-c834-4593-8904-00ea04646c45
      - button "Agregar subpágina en qa-auto-mv1lv191-sxin":
        - img
      - button "Acciones de qa-auto-mv1lv191-sxin":
        - img
    - listitem:
      - link "qa-auto-mv1lwuql-sw30":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/8cb9bc64-9039-4da3-9a45-0e4e6fce4c74
      - button "Agregar subpágina en qa-auto-mv1lwuql-sw30":
        - img
      - button "Acciones de qa-auto-mv1lwuql-sw30":
        - img
    - listitem:
      - link "qa-auto-mv1lwuql-tty8":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/b6a75cb2-04ee-4345-9968-26f3c2c465fc
      - button "Agregar subpágina en qa-auto-mv1lwuql-tty8":
        - img
      - button "Acciones de qa-auto-mv1lwuql-tty8":
        - img
    - listitem:
      - link "qa-auto-mv1lwur5-3avf":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/9700777b-43a4-476c-b515-effff75a02f1
      - button "Agregar subpágina en qa-auto-mv1lwur5-3avf":
        - img
      - button "Acciones de qa-auto-mv1lwur5-3avf":
        - img
    - listitem:
      - link "qa-auto-mv1lwzf6-97or":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/88536f0d-585c-4215-bb0b-0122f45cfa0f
      - button "Agregar subpágina en qa-auto-mv1lwzf6-97or":
        - img
      - button "Acciones de qa-auto-mv1lwzf6-97or":
        - img
    - listitem:
      - link "qa-auto-mv1lx1ap-a1fl":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/43560251-3158-4b66-904a-ce8caa6dfe16
      - button "Agregar subpágina en qa-auto-mv1lx1ap-a1fl":
        - img
      - button "Acciones de qa-auto-mv1lx1ap-a1fl":
        - img
    - listitem:
      - link "qa-auto-mv1lx4ku-70za":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/994b1ea6-b10e-4080-bfad-698820e562e2
      - button "Agregar subpágina en qa-auto-mv1lx4ku-70za":
        - img
      - button "Acciones de qa-auto-mv1lx4ku-70za":
        - img
    - listitem:
      - link "qa-auto-mv1lx52m-lvc9":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/7fda456e-4650-4308-855b-a85de877fdb4
      - button "Agregar subpágina en qa-auto-mv1lx52m-lvc9":
        - img
      - button "Acciones de qa-auto-mv1lx52m-lvc9":
        - img
    - listitem:
      - link "qa-auto-mv1lx85s-611m":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/d4493d5f-86f4-4329-9975-1e68235d6f9d
      - button "Agregar subpágina en qa-auto-mv1lx85s-611m":
        - img
      - button "Acciones de qa-auto-mv1lx85s-611m":
        - img
    - listitem:
      - link "qa-auto-mv1lxalf-imt7":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/8bb1a9a9-a0bf-4424-b242-fa83509dec78
      - button "Agregar subpágina en qa-auto-mv1lxalf-imt7":
        - img
      - button "Acciones de qa-auto-mv1lxalf-imt7":
        - img
    - listitem:
      - link "qa-auto-mv1lxanu-e8xt":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/327466d9-e93f-4483-bd18-44bdb38a77ce
      - button "Agregar subpágina en qa-auto-mv1lxanu-e8xt":
        - img
      - button "Acciones de qa-auto-mv1lxanu-e8xt":
        - img
    - listitem:
      - link "qa-auto-mv1lxfoj-1hwb":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/01d383b0-d211-4ffa-ac60-29e759976c4d
      - button "Agregar subpágina en qa-auto-mv1lxfoj-1hwb":
        - img
      - button "Acciones de qa-auto-mv1lxfoj-1hwb":
        - img
    - listitem:
      - link "qa-auto-mv1lxgms-mzkr":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/45277512-a706-4dfa-b8dd-0c43f50fbdc2
      - button "Agregar subpágina en qa-auto-mv1lxgms-mzkr":
        - img
      - button "Acciones de qa-auto-mv1lxgms-mzkr":
        - img
    - listitem:
      - link "qa-auto-mv1lxl7g-49go":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/ac3fd5b8-91db-437a-bda4-7df94bffd8e7
      - button "Agregar subpágina en qa-auto-mv1lxl7g-49go":
        - img
      - button "Acciones de qa-auto-mv1lxl7g-49go":
        - img
    - listitem:
      - link "qa-auto-mv1lxnne-pdhr":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/b3402ad8-eeef-479d-954e-2400524fff43
      - button "Agregar subpágina en qa-auto-mv1lxnne-pdhr":
        - img
      - button "Acciones de qa-auto-mv1lxnne-pdhr":
        - img
    - listitem:
      - link "qa-auto-mv1lxonh-kxqi":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/b094aaae-1363-4b83-af7a-356b16562a01
      - button "Agregar subpágina en qa-auto-mv1lxonh-kxqi":
        - img
      - button "Acciones de qa-auto-mv1lxonh-kxqi":
        - img
    - listitem:
      - link "qa-auto-mv1lxw0c-s3ub":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/8779b2b3-486d-45bb-8b8e-84cfb6644880
      - button "Agregar subpágina en qa-auto-mv1lxw0c-s3ub":
        - img
      - button "Acciones de qa-auto-mv1lxw0c-s3ub":
        - img
    - listitem:
      - link "qa-auto-mv1lxxtr-wth0":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/7923d334-6bb7-4fed-8907-d6da0aba80d3
      - button "Agregar subpágina en qa-auto-mv1lxxtr-wth0":
        - img
      - button "Acciones de qa-auto-mv1lxxtr-wth0":
        - img
    - listitem:
      - link "qa-auto-mv1ly007-reh5":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/3c6d24d0-76c6-4b83-8330-6a4cfa044d13
      - button "Agregar subpágina en qa-auto-mv1ly007-reh5":
        - img
      - button "Acciones de qa-auto-mv1ly007-reh5":
        - img
    - listitem:
      - link "qa-auto-mv1ly21x-2zw7":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/f5fd3162-25a0-48a5-84c0-0b7b7d163713
      - button "Agregar subpágina en qa-auto-mv1ly21x-2zw7":
        - img
      - button "Acciones de qa-auto-mv1ly21x-2zw7":
        - img
    - listitem:
      - link "qa-auto-mv1ly3t5-3bkp":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/e2b6e009-33fc-4c63-9fe9-ad64b50acecd
      - button "Agregar subpágina en qa-auto-mv1ly3t5-3bkp":
        - img
      - button "Acciones de qa-auto-mv1ly3t5-3bkp":
        - img
    - listitem:
      - link "qa-auto-mv1ly6yk-myn5":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/0aa3363c-056a-487f-8828-3fefd518e7a4
      - button "Agregar subpágina en qa-auto-mv1ly6yk-myn5":
        - img
      - button "Acciones de qa-auto-mv1ly6yk-myn5":
        - img
    - listitem:
      - link "qa-auto-mv1ly7t4-kj3j":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/e5aab1bd-606f-45f8-88c0-2679ef3065b1
      - button "Agregar subpágina en qa-auto-mv1ly7t4-kj3j":
        - img
      - button "Acciones de qa-auto-mv1ly7t4-kj3j":
        - img
    - listitem:
      - link "qa-auto-mv1ly99f-gyup":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/9207195d-0891-48cc-ae14-901800c79305
      - button "Agregar subpágina en qa-auto-mv1ly99f-gyup":
        - img
      - button "Acciones de qa-auto-mv1ly99f-gyup":
        - img
    - listitem:
      - link "qa-auto-mv1lybax-dmdj":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/1c8ba1f7-48b9-47d7-93e7-9c90f1926da8
      - button "Agregar subpágina en qa-auto-mv1lybax-dmdj":
        - img
      - button "Acciones de qa-auto-mv1lybax-dmdj":
        - img
    - listitem:
      - link "qa-auto-mv1lycc2-ezf1-b":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/6df813a9-e62d-4362-ad4c-cbf2362a48ac
      - button "Agregar subpágina en qa-auto-mv1lycc2-ezf1-b":
        - img
      - button "Acciones de qa-auto-mv1lycc2-ezf1-b":
        - img
    - listitem:
      - link "qa-auto-mv1lyfie-9ait":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/024160c3-9179-4e78-85df-5c23075e5c19
      - button "Agregar subpágina en qa-auto-mv1lyfie-9ait":
        - img
      - button "Acciones de qa-auto-mv1lyfie-9ait":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/0d5b41fb-959c-4022-8a72-74cd90c67245
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv1lyjc2-zpia":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/f6f36b89-65da-4ee1-b667-993eb3d013e4
      - button "Agregar subpágina en qa-auto-mv1lyjc2-zpia":
        - img
      - button "Acciones de qa-auto-mv1lyjc2-zpia":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/33f644ad-d265-462e-b03b-29a7ab94420f
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv1lzh14-1m89":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/d499872f-24bc-4e4a-bfef-4be4bd4ccc01
      - button "Agregar subpágina en qa-auto-mv1lzh14-1m89":
        - img
      - button "Acciones de qa-auto-mv1lzh14-1m89":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/9303889d-26f2-4420-8a5f-8ac31a04e278
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv1lzqzj-xksb":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/700e42c2-5bbb-45cc-a151-98afde97589c
      - button "Agregar subpágina en qa-auto-mv1lzqzj-xksb":
        - img
      - button "Acciones de qa-auto-mv1lzqzj-xksb":
        - img
    - listitem:
      - link "qa-auto-mv1m08lt-szgo":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/cde86eaf-2b79-4afa-8d2c-99d2444c14ad
      - button "Agregar subpágina en qa-auto-mv1m08lt-szgo":
        - img
      - button "Acciones de qa-auto-mv1m08lt-szgo":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/eb001fc2-39a0-4218-96ad-0edbdf5171ca
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv1m10pd-jljs":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/43cb8893-7e43-4459-93e8-aa32f8cb05ae
      - button "Agregar subpágina en qa-auto-mv1m10pd-jljs":
        - img
      - button "Acciones de qa-auto-mv1m10pd-jljs":
        - img
    - listitem:
      - link "qa-auto-mv1m1vta-5b5h":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/0472cb66-cb89-4fff-8ab0-94b70d308902
      - button "Agregar subpágina en qa-auto-mv1m1vta-5b5h":
        - img
      - button "Acciones de qa-auto-mv1m1vta-5b5h":
        - img
    - listitem:
      - link "qa-auto-mv1m1vtm-vhyd":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/3812b2e4-9f84-4919-a79f-e3e1750a8562
      - button "Agregar subpágina en qa-auto-mv1m1vtm-vhyd":
        - img
      - button "Acciones de qa-auto-mv1m1vtm-vhyd":
        - img
    - listitem:
      - link "qa-auto-mv1m1vu6-bxnc":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/ba41e6f9-146a-4d5f-a892-f9411972f75b
      - button "Agregar subpágina en qa-auto-mv1m1vu6-bxnc":
        - img
      - button "Acciones de qa-auto-mv1m1vu6-bxnc":
        - img
    - listitem:
      - link "qa-auto-mv1m1vtm-vhyd-b":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/de1cd92b-6d6b-4b47-adc5-ab09f4a8aee3
      - button "Agregar subpágina en qa-auto-mv1m1vtm-vhyd-b":
        - img
      - button "Acciones de qa-auto-mv1m1vtm-vhyd-b":
        - img
    - listitem:
      - link "qa-auto-mv1m24kl-8yn3":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/a99b6000-c98d-48b0-8da4-1e4747962ac9
      - button "Agregar subpágina en qa-auto-mv1m24kl-8yn3":
        - img
      - button "Acciones de qa-auto-mv1m24kl-8yn3":
        - img
    - listitem:
      - link "qa-auto-mv1m24u1-zpd7":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/9569abc8-4c29-40d8-a58c-0f6a742a59c5
      - button "Agregar subpágina en qa-auto-mv1m24u1-zpd7":
        - img
      - button "Acciones de qa-auto-mv1m24u1-zpd7":
        - img
    - listitem:
      - link "qa-auto-mv1m2q0d-p2d3":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/e045ec08-fb54-45fb-9627-1d06a4d001b2
      - button "Agregar subpágina en qa-auto-mv1m2q0d-p2d3":
        - img
      - button "Acciones de qa-auto-mv1m2q0d-p2d3":
        - img
    - listitem:
      - link "qa-auto-mv1m2q11-jv9v":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/a538511e-6a63-4e24-9de9-3a4c6f59d132
      - button "Agregar subpágina en qa-auto-mv1m2q11-jv9v":
        - img
      - button "Acciones de qa-auto-mv1m2q11-jv9v":
        - img
    - listitem:
      - link "qa-auto-mv1m2q2f-6h8j":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/b0d524f7-7f0d-420e-b00a-96793a18d6c4
      - button "Agregar subpágina en qa-auto-mv1m2q2f-6h8j":
        - img
      - button "Acciones de qa-auto-mv1m2q2f-6h8j":
        - img
    - listitem:
      - link "qa-auto-mv1m2tpw-9vyw":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/af0ba5fb-2d3e-4160-92e1-ddadc9f51012
      - button "Agregar subpágina en qa-auto-mv1m2tpw-9vyw":
        - img
      - button "Acciones de qa-auto-mv1m2tpw-9vyw":
        - img
    - listitem:
      - link "qa-auto-mv1m2wag-hg9s":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/048de1d4-f4ee-4071-9cc8-df9619ddae4c
      - button "Agregar subpágina en qa-auto-mv1m2wag-hg9s":
        - img
      - button "Acciones de qa-auto-mv1m2wag-hg9s":
        - img
    - listitem:
      - link "qa-auto-mv1m2wjs-bu9s":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/82382abd-3940-4928-bd6f-192f66b24c05
      - button "Agregar subpágina en qa-auto-mv1m2wjs-bu9s":
        - img
      - button "Acciones de qa-auto-mv1m2wjs-bu9s":
        - img
    - listitem:
      - link "qa-auto-mv1m2y26-rbav":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/6292effc-6842-4c1f-a83e-bd7c128b82bc
      - button "Agregar subpágina en qa-auto-mv1m2y26-rbav":
        - img
      - button "Acciones de qa-auto-mv1m2y26-rbav":
        - img
    - listitem:
      - link "qa-auto-mv1m2z9s-ohl8":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/b8ebb357-ff65-4eed-89e1-d658bf1b119d
      - button "Agregar subpágina en qa-auto-mv1m2z9s-ohl8":
        - img
      - button "Acciones de qa-auto-mv1m2z9s-ohl8":
        - img
    - listitem:
      - link "qa-auto-mv1m30is-z3px":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/a5234fe1-f203-4729-9235-935c1d8447de
      - button "Agregar subpágina en qa-auto-mv1m30is-z3px":
        - img
      - button "Acciones de qa-auto-mv1m30is-z3px":
        - img
    - listitem:
      - link "qa-auto-mv1m32wk-nl2r":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/c923f03b-7be5-4ec2-9e1f-ce4df15e79fc
      - button "Agregar subpágina en qa-auto-mv1m32wk-nl2r":
        - img
      - button "Acciones de qa-auto-mv1m32wk-nl2r":
        - img
    - listitem:
      - link "qa-auto-mv1m360m-ygnu":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/1ae5c12c-242b-46bc-9886-3a83e2df0694
      - button "Agregar subpágina en qa-auto-mv1m360m-ygnu":
        - img
      - button "Acciones de qa-auto-mv1m360m-ygnu":
        - img
    - listitem:
      - link "qa-auto-mv1m394b-lqr8":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/b42a1c99-b32d-44cb-90d6-e6ce65ec549f
      - button "Agregar subpágina en qa-auto-mv1m394b-lqr8":
        - img
      - button "Acciones de qa-auto-mv1m394b-lqr8":
        - img
    - listitem:
      - link "qa-auto-mv1m3clq-csn0":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/0b39d951-c72a-4c96-92fd-71bbed994aaf
      - button "Agregar subpágina en qa-auto-mv1m3clq-csn0":
        - img
      - button "Acciones de qa-auto-mv1m3clq-csn0":
        - img
    - listitem:
      - link "qa-auto-mv1m3fu6-nu8q":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/1337b921-7fef-4a3b-9f20-68ad8c8535ef
      - button "Agregar subpágina en qa-auto-mv1m3fu6-nu8q":
        - img
      - button "Acciones de qa-auto-mv1m3fu6-nu8q":
        - img
    - listitem:
      - link "qa-auto-mv1m3jl1-4las":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/6796d2ed-7a9b-4a06-89e7-10d5d57a00ba
      - button "Agregar subpágina en qa-auto-mv1m3jl1-4las":
        - img
      - button "Acciones de qa-auto-mv1m3jl1-4las":
        - img
    - listitem:
      - link "qa-auto-mv1m3ong-a8ti":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/960c1404-3e25-4d12-8c79-a32154f3906b
      - button "Agregar subpágina en qa-auto-mv1m3ong-a8ti":
        - img
      - button "Acciones de qa-auto-mv1m3ong-a8ti":
        - img
    - listitem:
      - link "qa-auto-mv1m3rny-go7l":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/c6900d60-6c42-4e6d-be35-a9ff9dfc2764
      - button "Agregar subpágina en qa-auto-mv1m3rny-go7l":
        - img
      - button "Acciones de qa-auto-mv1m3rny-go7l":
        - img
    - listitem:
      - link "qa-auto-mv1m3ug2-hgrg":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/37eb50d4-6d1e-4169-b106-fa123d10e739
      - button "Agregar subpágina en qa-auto-mv1m3ug2-hgrg":
        - img
      - button "Acciones de qa-auto-mv1m3ug2-hgrg":
        - img
    - listitem:
      - link "qa-auto-mv1m3y4j-42yi":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/59365732-84db-4e56-b039-0a7c0be4e08a
      - button "Agregar subpágina en qa-auto-mv1m3y4j-42yi":
        - img
      - button "Acciones de qa-auto-mv1m3y4j-42yi":
        - img
    - listitem:
      - link "qa-auto-mv1m411v-p60g":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/e150620b-57aa-48ea-9487-285344469bcf
      - button "Agregar subpágina en qa-auto-mv1m411v-p60g":
        - img
      - button "Acciones de qa-auto-mv1m411v-p60g":
        - img
    - listitem:
      - link "qa-auto-mv1m45fs-raj2":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/e97c0df0-b154-4505-a40b-9470bce909a8
      - button "Agregar subpágina en qa-auto-mv1m45fs-raj2":
        - img
      - button "Acciones de qa-auto-mv1m45fs-raj2":
        - img
    - listitem:
      - link "qa-auto-mv1m48zj-mr02":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/9dea2a28-f50d-40d7-a645-e69858539d8b
      - button "Agregar subpágina en qa-auto-mv1m48zj-mr02":
        - img
      - button "Acciones de qa-auto-mv1m48zj-mr02":
        - img
    - listitem:
      - link "qa-auto-mv1m4c7r-fy38":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/0e354dbb-576f-4b68-94ec-98db1b5fd6d3
      - button "Agregar subpágina en qa-auto-mv1m4c7r-fy38":
        - img
      - button "Acciones de qa-auto-mv1m4c7r-fy38":
        - img
    - listitem:
      - link "qa-auto-mv1m4cbj-yt98":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/3bb821d3-13f1-4157-a1ce-06052d3fce4e
      - button "Agregar subpágina en qa-auto-mv1m4cbj-yt98":
        - img
      - button "Acciones de qa-auto-mv1m4cbj-yt98":
        - img
    - listitem:
      - link "qa-auto-mv1m4cwo-r9jt":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/966cddd6-9f8b-487a-b240-b4c043a4e287
      - button "Agregar subpágina en qa-auto-mv1m4cwo-r9jt":
        - img
      - button "Acciones de qa-auto-mv1m4cwo-r9jt":
        - img
    - listitem:
      - link "qa-auto-mv1m4fdf-qbct":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/6c5506fe-b411-4de9-ac47-6b4485426b1f
      - button "Agregar subpágina en qa-auto-mv1m4fdf-qbct":
        - img
      - button "Acciones de qa-auto-mv1m4fdf-qbct":
        - img
    - listitem:
      - link "qa-auto-mv1m4fnr-kpnm":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/8f093403-708e-4770-9777-78f134ac5ccd
      - button "Agregar subpágina en qa-auto-mv1m4fnr-kpnm":
        - img
      - button "Acciones de qa-auto-mv1m4fnr-kpnm":
        - img
    - listitem:
      - link "qa-auto-mv1m4goz-6mp1":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/d500df45-9d0b-454f-81d9-7fe930ec099a
      - button "Agregar subpágina en qa-auto-mv1m4goz-6mp1":
        - img
      - button "Acciones de qa-auto-mv1m4goz-6mp1":
        - img
    - listitem:
      - link "qa-auto-mv1m4ir9-5slg":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/89349dac-f0dd-4274-a944-90b1fedef135
      - button "Agregar subpágina en qa-auto-mv1m4ir9-5slg":
        - img
      - button "Acciones de qa-auto-mv1m4ir9-5slg":
        - img
    - listitem:
      - link "qa-auto-mv1m4k23-27v8":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/60f11ab8-3dc3-44ee-bfb8-7cdfa7dc70a5
      - button "Agregar subpágina en qa-auto-mv1m4k23-27v8":
        - img
      - button "Acciones de qa-auto-mv1m4k23-27v8":
        - img
    - listitem:
      - link "qa-auto-mv1m4ps5-3tfl":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/df059e93-4e2c-411c-897c-92893b1fbba9
      - button "Agregar subpágina en qa-auto-mv1m4ps5-3tfl":
        - img
      - button "Acciones de qa-auto-mv1m4ps5-3tfl":
        - img
    - listitem:
      - link "qa-auto-mv1m4rbb-0z6b":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/3dc1ecb2-19b5-4dce-8fd8-d9e526fb050c
      - button "Agregar subpágina en qa-auto-mv1m4rbb-0z6b":
        - img
      - button "Acciones de qa-auto-mv1m4rbb-0z6b":
        - img
    - listitem:
      - link "qa-auto-mv1m4x62-ngec":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/1862ee15-9301-4d70-80b8-78ff1afa6879
      - button "Agregar subpágina en qa-auto-mv1m4x62-ngec":
        - img
      - button "Acciones de qa-auto-mv1m4x62-ngec":
        - img
    - listitem:
      - link "qa-auto-mv1m50t3-5c0u":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/6feaefde-c468-4d85-bbda-3b899d1a3f16
      - button "Agregar subpágina en qa-auto-mv1m50t3-5c0u":
        - img
      - button "Acciones de qa-auto-mv1m50t3-5c0u":
        - img
    - listitem:
      - link "qa-auto-mv1m52wy-lh6y":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/6c912cd8-cedb-49ca-a2fb-c4442a4c4625
      - button "Agregar subpágina en qa-auto-mv1m52wy-lh6y":
        - img
      - button "Acciones de qa-auto-mv1m52wy-lh6y":
        - img
    - listitem:
      - link "qa-auto-mv1m543m-zhs5":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/2e371550-461d-434a-98f7-8a32438b47de
      - button "Agregar subpágina en qa-auto-mv1m543m-zhs5":
        - img
      - button "Acciones de qa-auto-mv1m543m-zhs5":
        - img
    - listitem:
      - link "qa-auto-mv1m58np-6cel":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/e6f4324c-c04a-4e1e-98b4-51221743764f
      - button "Agregar subpágina en qa-auto-mv1m58np-6cel":
        - img
      - button "Acciones de qa-auto-mv1m58np-6cel":
        - img
    - listitem:
      - link "qa-auto-mv1m5bqf-g4fe":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/6f3e3a0e-fce1-4a45-a6de-bd0f9f1f8698
      - button "Agregar subpágina en qa-auto-mv1m5bqf-g4fe":
        - img
      - button "Acciones de qa-auto-mv1m5bqf-g4fe":
        - img
    - listitem:
      - link "qa-auto-mv1m5c10-yecd":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/4e72f7af-c6f8-4e6a-ab64-02240f0b0f86
      - button "Agregar subpágina en qa-auto-mv1m5c10-yecd":
        - img
      - button "Acciones de qa-auto-mv1m5c10-yecd":
        - img
    - listitem:
      - link "qa-auto-mv1m5fih-yo7n":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/6686a340-a44f-4a20-8d7c-08c86314924f
      - button "Agregar subpágina en qa-auto-mv1m5fih-yo7n":
        - img
      - button "Acciones de qa-auto-mv1m5fih-yo7n":
        - img
    - listitem:
      - link "qa-auto-mv1m5fx4-8k0y":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/0c7fe923-fc11-4104-a6e1-aa1f27c22eae
      - button "Agregar subpágina en qa-auto-mv1m5fx4-8k0y":
        - img
      - button "Acciones de qa-auto-mv1m5fx4-8k0y":
        - img
    - listitem:
      - link "qa-auto-mv1m5ih9-ynck":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/4e49e926-ec72-412b-8c3f-40b3404feedd
      - button "Agregar subpágina en qa-auto-mv1m5ih9-ynck":
        - img
      - button "Acciones de qa-auto-mv1m5ih9-ynck":
        - img
    - listitem:
      - link "qa-auto-mv1m5jwp-5m0o":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/e53e4c5f-4c7d-470c-b0b7-4ab18a65ce29
      - button "Agregar subpágina en qa-auto-mv1m5jwp-5m0o":
        - img
      - button "Acciones de qa-auto-mv1m5jwp-5m0o":
        - img
    - listitem:
      - link "qa-auto-mv1m5ls5-vagj":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/0c9dfd21-4d1e-4567-b9d7-07dadfaf542a
      - button "Agregar subpágina en qa-auto-mv1m5ls5-vagj":
        - img
      - button "Acciones de qa-auto-mv1m5ls5-vagj":
        - img
    - listitem:
      - link "qa-auto-mv1m5nu4-irnp":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/79af598e-b718-434c-9a25-bcc90fb1f681
      - button "Agregar subpágina en qa-auto-mv1m5nu4-irnp":
        - img
      - button "Acciones de qa-auto-mv1m5nu4-irnp":
        - img
    - listitem:
      - link "qa-auto-mv1m5p19-exu9":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/244ddccb-8b66-411a-99fc-78b53dcb2909
      - button "Agregar subpágina en qa-auto-mv1m5p19-exu9":
        - img
      - button "Acciones de qa-auto-mv1m5p19-exu9":
        - img
    - listitem:
      - link "qa-auto-mv1m5pr9-dvop":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/3114013c-d1e6-4f63-b772-30521b187c61
      - button "Agregar subpágina en qa-auto-mv1m5pr9-dvop":
        - img
      - button "Acciones de qa-auto-mv1m5pr9-dvop":
        - img
    - listitem:
      - link "qa-auto-mv1m5t16-z265":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/45df145a-bcf9-4994-884f-5c18b81ed012
      - button "Agregar subpágina en qa-auto-mv1m5t16-z265":
        - img
      - button "Acciones de qa-auto-mv1m5t16-z265":
        - img
    - listitem:
      - link "qa-auto-mv1m5ur2-1z77":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/165bd293-0f0a-463b-8802-689248827f65
      - button "Agregar subpágina en qa-auto-mv1m5ur2-1z77":
        - img
      - button "Acciones de qa-auto-mv1m5ur2-1z77":
        - img
    - listitem:
      - link "qa-auto-mv1m5v2g-iqnl":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/a10702b9-33c7-4189-be0f-f7b75c1227e0
      - button "Agregar subpágina en qa-auto-mv1m5v2g-iqnl":
        - img
      - button "Acciones de qa-auto-mv1m5v2g-iqnl":
        - img
    - listitem:
      - link "qa-auto-mv1m5wok-vif4":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/f28b0c91-3ac9-4615-b5fb-55bae95d9c75
      - button "Agregar subpágina en qa-auto-mv1m5wok-vif4":
        - img
      - button "Acciones de qa-auto-mv1m5wok-vif4":
        - img
    - listitem:
      - link "qa-auto-mv1m5yxj-ezpg":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/1ee6d456-a681-4d44-bb44-c181e0d35469
      - button "Agregar subpágina en qa-auto-mv1m5yxj-ezpg":
        - img
      - button "Acciones de qa-auto-mv1m5yxj-ezpg":
        - img
    - listitem:
      - link "qa-auto-mv1m5zzt-r7aq":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/46d44745-6dca-43de-b160-7914275e67bb
      - button "Agregar subpágina en qa-auto-mv1m5zzt-r7aq":
        - img
      - button "Acciones de qa-auto-mv1m5zzt-r7aq":
        - img
    - listitem:
      - link "qa-auto-mv1m6248-d8yl":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/6d6292d0-ccf0-4b04-93d7-ed6ad1c09a91
      - button "Agregar subpágina en qa-auto-mv1m6248-d8yl":
        - img
      - button "Acciones de qa-auto-mv1m6248-d8yl":
        - img
    - listitem:
      - link "qa-auto-mv1m65mz-q331":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/066dd46a-6ee3-4bc1-a6c4-3f391a9763eb
      - button "Agregar subpágina en qa-auto-mv1m65mz-q331":
        - img
      - button "Acciones de qa-auto-mv1m65mz-q331":
        - img
    - listitem:
      - link "qa-auto-mv1m65xf-xpgt":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/0396d1f2-539d-4427-ae96-b4ebf0ba2c9d
      - button "Agregar subpágina en qa-auto-mv1m65xf-xpgt":
        - img
      - button "Acciones de qa-auto-mv1m65xf-xpgt":
        - img
    - listitem:
      - link "qa-auto-mv1m68np-0797":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/b0772bb3-fa18-459a-9f7d-dce05e7d4fbf
      - button "Agregar subpágina en qa-auto-mv1m68np-0797":
        - img
      - button "Acciones de qa-auto-mv1m68np-0797":
        - img
    - listitem:
      - link "qa-auto-mv1m6b31-z44v":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/7257b138-4806-4b65-bf62-89de8b08c1d8
      - button "Agregar subpágina en qa-auto-mv1m6b31-z44v":
        - img
      - button "Acciones de qa-auto-mv1m6b31-z44v":
        - img
    - listitem:
      - link "qa-auto-mv1m6b5l-qmzs":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/eea6ea7f-889a-4fb4-bbfe-044f2047a1ea
      - button "Agregar subpágina en qa-auto-mv1m6b5l-qmzs":
        - img
      - button "Acciones de qa-auto-mv1m6b5l-qmzs":
        - img
    - listitem:
      - link "qa-auto-mv1m6exd-rcwl":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/be18d28a-a2ec-4475-a1e1-5be1b2effea0
      - button "Agregar subpágina en qa-auto-mv1m6exd-rcwl":
        - img
      - button "Acciones de qa-auto-mv1m6exd-rcwl":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/200b5a17-3f7f-494e-b1c4-612d8cdf8e45
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv1m6j7b-mt8x":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/9beac7fc-f5b8-4f65-84ea-195fe5127685
      - button "Agregar subpágina en qa-auto-mv1m6j7b-mt8x":
        - img
      - button "Acciones de qa-auto-mv1m6j7b-mt8x":
        - img
    - listitem:
      - link "qa-auto-mv1m6lmr-bkps":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/67c938d4-e938-4d0c-9e5c-8c65db93ae04
      - button "Agregar subpágina en qa-auto-mv1m6lmr-bkps":
        - img
      - button "Acciones de qa-auto-mv1m6lmr-bkps":
        - img
    - listitem:
      - link "qa-auto-mv1m6oy7-mp17":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/38b11a46-9be8-4289-9fa8-da51b3324513
      - button "Agregar subpágina en qa-auto-mv1m6oy7-mp17":
        - img
      - button "Acciones de qa-auto-mv1m6oy7-mp17":
        - img
    - listitem:
      - link "qa-auto-mv1m6qt6-n1tt":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/5762eee0-ac60-4c1f-b53a-64ef65f388ec
      - button "Agregar subpágina en qa-auto-mv1m6qt6-n1tt":
        - img
      - button "Acciones de qa-auto-mv1m6qt6-n1tt":
        - img
    - listitem:
      - link "qa-auto-mv1m6qxk-kv9f":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/f547e132-d225-4c2f-be6c-242ffe7a9d93
      - button "Agregar subpágina en qa-auto-mv1m6qxk-kv9f":
        - img
      - button "Acciones de qa-auto-mv1m6qxk-kv9f":
        - img
    - listitem:
      - link "qa-auto-mv1m6qxk-kv9f-b":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/f595498f-615d-4b62-915d-8b281ee4c84a
      - button "Agregar subpágina en qa-auto-mv1m6qxk-kv9f-b":
        - img
      - button "Acciones de qa-auto-mv1m6qxk-kv9f-b":
        - img
    - listitem:
      - button "Expandir qa-auto-mv1m6xht-2lyh":
        - img
      - link "qa-auto-mv1m6xht-2lyh":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/4a9497d3-621d-48a9-af29-6053d243bafe
      - button "Agregar subpágina en qa-auto-mv1m6xht-2lyh":
        - img
      - button "Acciones de qa-auto-mv1m6xht-2lyh":
        - img
    - listitem:
      - link "qa-auto-mv1m7039-ia0u":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/023bf774-ad27-4fe3-90af-9bcee227a4c6
      - button "Agregar subpágina en qa-auto-mv1m7039-ia0u":
        - img
      - button "Acciones de qa-auto-mv1m7039-ia0u":
        - img
    - listitem:
      - link "qa-auto-mv1m718l-lq21":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/e8a9eb7f-76db-43fe-a417-263220d43cdb
      - button "Agregar subpágina en qa-auto-mv1m718l-lq21":
        - img
      - button "Acciones de qa-auto-mv1m718l-lq21":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/28528119-b7ed-47d2-a15d-96961d577fe3
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/37d9156a-81e3-4a8e-bd58-daad813dfbbe
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv1m7ekt-4zq4":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/a2ff991a-2d7b-43ff-b41e-3d13cf2d8b41
      - button "Agregar subpágina en qa-auto-mv1m7ekt-4zq4":
        - img
      - button "Acciones de qa-auto-mv1m7ekt-4zq4":
        - img
    - listitem:
      - link "qa-auto-mv1m7umb-2faw":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/2808c45e-873a-4a3d-9d50-55c52e98ebd6
      - button "Agregar subpágina en qa-auto-mv1m7umb-2faw":
        - img
      - button "Acciones de qa-auto-mv1m7umb-2faw":
        - img
    - listitem:
      - link "qa-auto-mv1m7vrs-snd2":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/13ad88a4-82a6-4350-94e8-5c35ef93a09f
      - button "Agregar subpágina en qa-auto-mv1m7vrs-snd2":
        - img
      - button "Acciones de qa-auto-mv1m7vrs-snd2":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/53696219-1e31-4f67-a43f-e95e0845429f
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv1m871o-p7ad":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/90a68055-d0d3-4af8-b608-49788b9cf009
      - button "Agregar subpágina en qa-auto-mv1m871o-p7ad":
        - img
      - button "Acciones de qa-auto-mv1m871o-p7ad":
        - img
    - listitem:
      - link "qa-auto-mv1m8nqf-gyfv":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/bc5115dc-a1c7-44b2-974a-083d89dcf22d
      - button "Agregar subpágina en qa-auto-mv1m8nqf-gyfv":
        - img
      - button "Acciones de qa-auto-mv1m8nqf-gyfv":
        - img
    - listitem:
      - link "qa-auto-mv1m8nhr-rff7":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/c716a908-3b06-4229-8bc7-b29b57fc5be0
      - button "Agregar subpágina en qa-auto-mv1m8nhr-rff7":
        - img
      - button "Acciones de qa-auto-mv1m8nhr-rff7":
        - img
    - listitem:
      - button "Expandir qa-auto-mv1m8oop-h88v":
        - img
      - link "qa-auto-mv1m8oop-h88v":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/648b192c-716c-4f2e-a5e9-9cf969b8550f
      - button "Agregar subpágina en qa-auto-mv1m8oop-h88v":
        - img
      - button "Acciones de qa-auto-mv1m8oop-h88v":
        - img
    - listitem:
      - link "qa-auto-mv1m8s63-hwiz":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/bd2f24fe-6fb2-4b4b-88cf-e12d719a928e
      - button "Agregar subpágina en qa-auto-mv1m8s63-hwiz":
        - img
      - button "Acciones de qa-auto-mv1m8s63-hwiz":
        - img
    - listitem:
      - link "qa-auto-mv1m8w00-k0n3":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/9e012e6f-a8b9-4446-aa68-12b5cd475d91
      - button "Agregar subpágina en qa-auto-mv1m8w00-k0n3":
        - img
      - button "Acciones de qa-auto-mv1m8w00-k0n3":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/e2c00e92-82ae-464e-819b-9dde3cfa5acf
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/e8451fe4-8147-4591-9aa5-ac857abec2df
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv1mahua-yaaw":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/8babd564-23d7-47b8-8eee-535888c631b6
      - button "Agregar subpágina en qa-auto-mv1mahua-yaaw":
        - img
      - button "Acciones de qa-auto-mv1mahua-yaaw":
        - img
    - listitem:
      - link "qa-auto-mv1mahuy-fidq":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/800554ae-2801-4c45-b846-1c34c2d2ea6c
      - button "Agregar subpágina en qa-auto-mv1mahuy-fidq":
        - img
      - button "Acciones de qa-auto-mv1mahuy-fidq":
        - img
    - listitem:
      - link "qa-auto-mv1maibq-fzsq":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/bb505241-0848-4cdd-a9e4-bc2217908b7f
      - button "Agregar subpágina en qa-auto-mv1maibq-fzsq":
        - img
      - button "Acciones de qa-auto-mv1maibq-fzsq":
        - img
    - listitem:
      - link "qa-auto-mv1maq02-hxal":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/0daa5585-bbb1-4c1e-a09a-8d4a2d7c61a6
      - button "Agregar subpágina en qa-auto-mv1maq02-hxal":
        - img
      - button "Acciones de qa-auto-mv1maq02-hxal":
        - img
    - listitem:
      - link "qa-auto-mv1maqvw-hnzd":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/4859bef6-7076-4bf0-a2ea-2de21f686b66
      - button "Agregar subpágina en qa-auto-mv1maqvw-hnzd":
        - img
      - button "Acciones de qa-auto-mv1maqvw-hnzd":
        - img
    - listitem:
      - link "qa-auto-mv1marn3-vsp3":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/9816b8b9-2ae3-42f1-837e-492f1aac0a6e
      - button "Agregar subpágina en qa-auto-mv1marn3-vsp3":
        - img
      - button "Acciones de qa-auto-mv1marn3-vsp3":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/6d1aa371-3ba3-423e-a06f-a481fc80ab89
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/821d0cc5-807c-466a-bc0f-d88745c06463
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/f9a64f7f-c2b1-4f4f-a582-3c2ed2b907a2
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/9a7f31d9-81fa-40ab-9e33-4cd89f389ba1
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv1mbp78-4o0v":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/51f618c0-3d24-4e35-b8c2-a2b1dda5c886
      - button "Agregar subpágina en qa-auto-mv1mbp78-4o0v":
        - img
      - button "Acciones de qa-auto-mv1mbp78-4o0v":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/8c99115b-7b56-4953-9fac-60e5109072ed
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv1mcfmu-kivy":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/38ea1562-a11f-4fa0-8e07-8dae6d25bf0d
      - button "Agregar subpágina en qa-auto-mv1mcfmu-kivy":
        - img
      - button "Acciones de qa-auto-mv1mcfmu-kivy":
        - img
    - listitem:
      - link "qa-auto-mv1mcfni-4zs7":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/491390f1-e031-41e3-8359-4700ad341db6
      - button "Agregar subpágina en qa-auto-mv1mcfni-4zs7":
        - img
      - button "Acciones de qa-auto-mv1mcfni-4zs7":
        - img
    - listitem:
      - link "qa-auto-mv1mcfo5-ze8m":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/615be8af-6761-4834-8afb-fc93f2dd5fac
      - button "Agregar subpágina en qa-auto-mv1mcfo5-ze8m":
        - img
      - button "Acciones de qa-auto-mv1mcfo5-ze8m":
        - img
    - listitem:
      - link "qa-auto-mv1mcfo5-ze8m-b":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/a4d806fd-caee-4038-a623-16d95fba7e99
      - button "Agregar subpágina en qa-auto-mv1mcfo5-ze8m-b":
        - img
      - button "Acciones de qa-auto-mv1mcfo5-ze8m-b":
        - img
    - listitem:
      - link "qa-auto-mv1mcfmu-kivy-b":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/dc383d5e-1f45-47e8-b977-496e65b42ef9
      - button "Agregar subpágina en qa-auto-mv1mcfmu-kivy-b":
        - img
      - button "Acciones de qa-auto-mv1mcfmu-kivy-b":
        - img
    - listitem:
      - link "qa-auto-mv1mcfni-4zs7-b":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/4b603c65-4887-40a7-a57f-a65fbc2fca75
      - button "Agregar subpágina en qa-auto-mv1mcfni-4zs7-b":
        - img
      - button "Acciones de qa-auto-mv1mcfni-4zs7-b":
        - img
    - listitem:
      - link "qa-auto-mv1mehfg-0h5v":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/631e3635-3c6c-46b8-8c2f-2c4808aa14f3
      - button "Agregar subpágina en qa-auto-mv1mehfg-0h5v":
        - img
      - button "Acciones de qa-auto-mv1mehfg-0h5v":
        - img
    - listitem:
      - link "qa-auto-mv2kdiy1-uibz":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/70c8712f-9a10-4f9b-acdd-6bc19bd9b325
      - button "Agregar subpágina en qa-auto-mv2kdiy1-uibz":
        - img
      - button "Acciones de qa-auto-mv2kdiy1-uibz":
        - img
    - listitem:
      - link "qa-auto-mv40rabp-5zs2":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/d89233b7-7073-43b3-8139-f190c74a15e9
      - button "Agregar subpágina en qa-auto-mv40rabp-5zs2":
        - img
      - button "Acciones de qa-auto-mv40rabp-5zs2":
        - img
    - listitem:
      - link "qa-auto-mv59oced-csu5":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/46f56aa2-7eca-402c-83c1-9306e6417db2
      - button "Agregar subpágina en qa-auto-mv59oced-csu5":
        - img
      - button "Acciones de qa-auto-mv59oced-csu5":
        - img
    - listitem:
      - link "qa-auto-mv59oy1s-gjxn":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/984ad947-6e08-49b9-bd0e-bcc7581e084f
      - button "Agregar subpágina en qa-auto-mv59oy1s-gjxn":
        - img
      - button "Acciones de qa-auto-mv59oy1s-gjxn":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/cec5bfba-1aab-480f-a23d-f74ce24e2428
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv59pv7h-9jx2":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/75fb54af-d9a1-4b39-abdc-862b90ee9729
      - button "Agregar subpágina en qa-auto-mv59pv7h-9jx2":
        - img
      - button "Acciones de qa-auto-mv59pv7h-9jx2":
        - img
    - listitem:
      - link "qa-auto-mv59qfdr-zya5":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/e0e28641-a8a2-445a-8cd0-05e07cdd04dc
      - button "Agregar subpágina en qa-auto-mv59qfdr-zya5":
        - img
      - button "Acciones de qa-auto-mv59qfdr-zya5":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/c462748f-e17f-4037-af8e-f112ba02ba64
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv59qxd1-igba":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/478d25ce-56d6-4e4e-b013-11920ae9a226
      - button "Agregar subpágina en qa-auto-mv59qxd1-igba":
        - img
      - button "Acciones de qa-auto-mv59qxd1-igba":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/af8b8d69-8061-4130-a049-6670a71599c9
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/1ea69cec-7ab1-4eac-9798-99b0ca5a4584
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/649f241c-e5d7-4494-9e12-d7806501974a
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv59sfwp-0mlz":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/24e9d311-05ba-4abc-9a9c-a695b6c2fa94
      - button "Agregar subpágina en qa-auto-mv59sfwp-0mlz":
        - img
      - button "Acciones de qa-auto-mv59sfwp-0mlz":
        - img
    - listitem:
      - link "qa-auto-mv59sjth-d9yi":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/81916006-7768-4e36-9dcc-c5703c3ca108
      - button "Agregar subpágina en qa-auto-mv59sjth-d9yi":
        - img
      - button "Acciones de qa-auto-mv59sjth-d9yi":
        - img
    - listitem:
      - link "qa-auto-mv59sygm-ezat":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/beed0795-b105-485d-a3f7-2066c3cae506
      - button "Agregar subpágina en qa-auto-mv59sygm-ezat":
        - img
      - button "Acciones de qa-auto-mv59sygm-ezat":
        - img
    - listitem:
      - link "qa-auto-mv59u3qf-765w":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/dbd7d44b-6eb8-4786-a53f-c2f13cbd22b7
      - button "Agregar subpágina en qa-auto-mv59u3qf-765w":
        - img
      - button "Acciones de qa-auto-mv59u3qf-765w":
        - img
    - listitem:
      - link "qa-auto-mv59usxl-rxnm":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/5906207b-8c6f-4965-9144-f193e7549f52
      - button "Agregar subpágina en qa-auto-mv59usxl-rxnm":
        - img
      - button "Acciones de qa-auto-mv59usxl-rxnm":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/ba50b8c7-728a-44e9-a135-412b7c6411c9
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv59vk2n-tvkn":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/d0ce06c1-89f6-4b2a-b76b-611c88b056b3
      - button "Agregar subpágina en qa-auto-mv59vk2n-tvkn":
        - img
      - button "Acciones de qa-auto-mv59vk2n-tvkn":
        - img
    - listitem:
      - link "Sin título":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/c3017af3-5cd5-411c-834e-cc864cffd537
      - button "Agregar subpágina en Sin título":
        - img
      - button "Acciones de Sin título":
        - img
    - listitem:
      - link "qa-auto-mv59w94s-eujq":
        - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/p/dc60516b-481f-4168-bb00-3e3600a1f9db
      - button "Agregar subpágina en qa-auto-mv59w94s-eujq":
        - img
      - button "Acciones de qa-auto-mv59w94s-eujq":
        - img
- list:
  - listitem:
    - link "Papelera":
      - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/trash
      - img
      - text: Papelera
  - listitem:
    - link "Miembros":
      - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/settings/members
      - img
      - text: Miembros
  - listitem:
    - link "Grupos":
      - /url: /w/a1afe693-6a4a-4e43-aa9d-a537bdfae4f7/settings/groups
      - img
      - text: Grupos
  - listitem:
    - link "Preferencias":
      - /url: /settings
      - img
      - text: Preferencias
  - listitem:
    - link "Perfil":
      - /url: /profile
      - img
      - text: Perfil
  - listitem:
    - button "Cerrar sesión":
      - img
      - text: Cerrar sesión
- main:
  - main:
    - article:
      - navigation "Ruta de la página":
        - list:
          - listitem: qa-auto-mv59w94s-eujq
      - button "Compartir":
        - img
        - text: Compartir
      - button "Mover":
        - img
        - text: Mover
      - button "Archivar":
        - img
        - text: Archivar
      - group: 📄
      - textbox "Título de la página":
        - /placeholder: Sin título
        - text: qa-auto-mv59w94s-eujq
      - status "Estado de guardado": Guardado
      - button "Seleccionar bloques"
      - button "Deshacer"
      - button "Rehacer"
      - toolbar "Formato de texto":
        - button "Negrita":
          - strong: B
        - button "Cursiva":
          - emphasis: I
        - button "Tachado": S
        - button "Texto"
        - button "Título"
        - button "Viñetas"
        - button "Numeración"
        - button "Título 1"
        - button "Título 2"
        - button "Título 3"
        - button "Color default": Sin color
        - button "Color red": Rojo
        - button "Color blue": Azul
        - button "Color green": Verde
        - button "Enlace"
        - button "Insertar tabla"
        - text: Imagen
        - button "Insertar imagen"
        - text: Adjuntar archivo
        - button "Adjuntar archivo"
        - button "Deshacer"
        - button "Rehacer"
      - textbox:
        - alert:
          - text: No se pudo subir la imagen.
          - button "Reintentar"
          - button "Quitar"
      - button "Agregar bloque":
        - img
        - text: Agregar bloque
      - button "Agregar tabla"
      - img
      - text: Agregar imagen
      - button "Agregar imagen"
- region "Notifications alt+T"
```

# Test source

```ts
  59  |     const texts = await editor.visibleTexts();
  60  |     expect(texts[0]).toBe('Before the external image QA');
  61  |     expect(texts.at(-1)).toBe('After the external image QA');
  62  |     expect(external).toEqual([]);
  63  |   });
  64  | 
  65  |   test('TC0063 - an embedded image over 5 MB is rejected on paste while the surrounding text is kept', async ({ createdPage, editor }) => {
  66  |     await editor.start();
  67  |     const huge = `data:image/png;base64,${Buffer.alloc(FIVE_MB + 100_000, 1).toString('base64')}`;
  68  |     await editor.pasteSynthetic({ html: `<p>Before huge QA</p><p><img src="${huge}" alt="huge.png"></p><p>After huge QA</p>` });
  69  |     await expect(editor.toasts.filter({ hasText: 'supera el máximo de 5 MB' })).toBeVisible({ timeout: 20_000 });
  70  |     await expect.poll(() => editor.visibleTexts()).toEqual(['Before huge QA', 'After huge QA']);
  71  |     await expect(editor.surface.getByRole('img')).toHaveCount(0);
  72  |   });
  73  | });
  74  | 
  75  | test.describe('Editor images - upload failures, undo and limits', () => {
  76  |   test('TC0064 - a failed upload ends in a recoverable error: Reintentar imports it, Quitar removes it', async ({ createdPage, editor, page }) => {
  77  |     const fail = (route) => route.abort('failed');
  78  |     await page.route('**/storage/v1/object/**', fail);
  79  |     await editor.start();
  80  |     await editor.pasteSynthetic({ html: fixtureText('images-inline.html') });
  81  |     const failed = uploadFailure(editor);
  82  |     await expect(failed).toBeVisible({ timeout: 20_000 });
  83  |     await expect(uploading(editor)).toHaveCount(0);
  84  |     await page.unroute('**/storage/v1/object/**', fail);
  85  |     await failed.getByRole('button', { name: 'Reintentar' }).click();
  86  |     await expect(editor.surface.getByRole('img')).toHaveCount(1, { timeout: 20_000 });
  87  |     await editor.expectSaved();
  88  | 
  89  |     await page.route('**/storage/v1/object/**', fail);
  90  |     await editor.caret('after in the same paragraph QA', 'end');
  91  |     await editor.pasteSynthetic({ files: [pngPayload('red', 'second.png')] });
  92  |     await expect(failed).toBeVisible({ timeout: 20_000 });
  93  |     await failed.getByRole('button', { name: 'Quitar' }).click();
  94  |     await expect(failed).toHaveCount(0);
  95  |     await page.unroute('**/storage/v1/object/**', fail);
  96  |     await editor.expectSaved();
  97  |     await expect(editor.surface.getByRole('img')).toHaveCount(1);
  98  |   });
  99  | 
  100 |   test('TC0065 - an image deleted and restored with undo is recovered, saved, and still there after reload', async ({ createdPage, editor }) => {
  101 |     await editor.start();
  102 |     await editor.pasteSynthetic({ files: [pngPayload('blue', 'restore.png')] });
  103 |     const image = editor.surface.getByRole('img');
  104 |     await expect(image).toBeVisible({ timeout: 20_000 });
  105 |     await editor.expectSaved();
  106 |     await editor.deleteViaSelection(/\.png/);
  107 |     await expect(image).toHaveCount(0);
  108 |     await editor.undo.click();
  109 |     await expect(image).toBeVisible();
  110 |     await editor.expectSaved();
  111 |     await editor.reloadAndWait();
  112 |     await expect.poll(() => editor.imagesLoaded()).toEqual([true]);
  113 |   });
  114 | 
  115 |   test('TC0066 - upload, delete and undo in quick succession (upload still in flight) recovers the image', async ({ createdPage, editor, page }) => {
  116 |     let release;
  117 |     const gate = new Promise((resolve) => { release = resolve; });
  118 |     await page.route('**/storage/v1/object/**', async (route) => {
  119 |       if (route.request().method() === 'POST') await gate;
  120 |       await route.continue();
  121 |     });
  122 |     await editor.start();
  123 |     await editor.pasteSynthetic({ files: [pngPayload('red', 'quick.png')] });
  124 |     await expect(uploading(editor)).toBeVisible();
  125 |     await editor.deleteViaSelection(/Bloque vacío/);
  126 |     await expect(uploading(editor)).toHaveCount(0);
  127 |     await editor.undo.click();
  128 |     await expect(uploading(editor)).toBeVisible();
  129 |     release();
  130 |     await expect(editor.surface.getByRole('img')).toBeVisible({ timeout: 20_000 });
  131 |     await editor.expectSaved();
  132 |     await editor.reloadAndWait();
  133 |     await expect.poll(() => editor.imagesLoaded()).toEqual([true]);
  134 |   });
  135 | 
  136 |   // Known defect DEF-04.
  137 |   test('TC0067 - undo AFTER the in-flight upload finished while the image was deleted still restores a usable image', async ({ createdPage, editor, page }, testInfo) => {
  138 |     testInfo.annotations.push({ type: 'defect', description: 'DEF-04: the upload finishing while the placeholder is deleted discards the file, so undo restores a broken placeholder' });
  139 |     let release;
  140 |     const gate = new Promise((resolve) => { release = resolve; });
  141 |     await page.route('**/storage/v1/object/**', async (route) => {
  142 |       if (route.request().method() === 'POST') await gate;
  143 |       await route.continue();
  144 |     });
  145 |     await editor.start();
  146 |     await editor.pasteSynthetic({ files: [pngPayload('green', 'late.png')] });
  147 |     await expect(uploading(editor)).toBeVisible();
  148 |     await editor.deleteViaSelection(/Bloque vacío/);
  149 |     const uploaded = page.waitForResponse((r) => r.url().includes('/storage/v1/object/') && r.request().method() === 'POST');
  150 |     release();
  151 |     await uploaded;
  152 |     await editor.expectSaved();
  153 |     await editor.undo.click();
  154 |     // Acceptable outcomes: the image, or an error the person can recover from with "Reintentar".
  155 |     const image = editor.surface.getByRole('img');
  156 |     const failed = uploadFailure(editor);
  157 |     await expect(image.or(failed)).toBeVisible({ timeout: 20_000 });
  158 |     if (await failed.isVisible()) await failed.getByRole('button', { name: 'Reintentar' }).click();
> 159 |     await expect(image).toBeVisible({ timeout: 20_000 });
      |                         ^ Error: expect(locator).toBeVisible() failed
  160 |     await editor.expectSaved();
  161 |     await editor.reloadAndWait();
  162 |     await expect.poll(() => editor.imagesLoaded()).toEqual([true]);
  163 |   });
  164 | 
  165 |   for (const [tc, label, file] of [
  166 |     ['TC0068', 'an unsupported image format', { name: 'logo.bmp', mimeType: 'image/bmp', buffer: Buffer.from('BM-not-supported') }],
  167 |     ['TC0069', 'an image over 5 MB', { name: 'huge.png', mimeType: 'image/png', buffer: Buffer.alloc(FIVE_MB + 1, 1) }],
  168 |   ]) {
  169 |     test(`${tc} - ${label} is refused with a message and the page content is untouched`, async ({ createdPage, editor }) => {
  170 |       await editor.start({ saved: ['Previous content QA'] });
  171 |       await editor.imageInput.setInputFiles(file);
  172 |       await expect(editor.toasts.filter({ hasText: /Solo se pueden subir imágenes|supera el máximo de 5 MB/ })).toBeVisible();
  173 |       await expect(editor.surface.getByRole('img')).toHaveCount(0);
  174 |       await expect(editor.block('Previous content QA')).toBeVisible();
  175 |       await editor.expectSaved();
  176 |       await editor.reloadAndWait();
  177 |       expect(await editor.visibleTexts()).toEqual(['Previous content QA']);
  178 |     });
  179 |   }
  180 | });
  181 | 
  182 | test.describe('Editor attachments', () => {
  183 |   test('TC0070 - opening the file picker does not unmount the toolbar or the input (emulating the dialog blur)', async ({ createdPage, editor, page }) => {
  184 |     await editor.start({ focus: false });
  185 |     const chooser = await editor.openAttachmentChooser();
  186 |     // A native dialog blurs the page with no related target. The OS dialog itself cannot be driven by Playwright.
  187 |     await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  188 |     await expect(editor.toolbar).toBeVisible();
  189 |     await expect(editor.attachmentInput).toBeAttached();
  190 |     await chooser.setFiles({ name: 'reporte-qa.txt', mimeType: 'text/plain', buffer: fixtureBytes('attachments/reporte-qa.txt') });
  191 |     await expect(editor.attachmentRow('reporte-qa.txt')).toBeVisible({ timeout: 20_000 });
  192 |   });
  193 | 
  194 |   for (const [tc, name, mimeType] of [['TC0071', 'reporte-qa.txt', 'text/plain'], ['TC0072', 'datos-qa.csv', 'text/csv']]) {
  195 |     test(`${tc} - ${name} can be attached, opened, downloaded with its content, and persists after reload`, async ({ createdPage, editor, page }) => {
  196 |       await editor.start({ focus: false });
  197 |       const buffer = fixtureBytes(`attachments/${name}`);
  198 |       const chooser = await editor.openAttachmentChooser();
  199 |       await chooser.setFiles({ name, mimeType, buffer });
  200 |       const row = editor.attachmentRow(name);
  201 |       await expect(row).toBeVisible({ timeout: 20_000 });
  202 |       await editor.expectSaved();
  203 | 
  204 |       const downloadLink = row.getByRole('link', { name: 'Descargar', exact: true });
  205 |       // Observable state: the link carries the server-signed "download" URL. Before that it points at the inline URL,
  206 |       // which a cross-origin <a download> cannot turn into a download (DEF-05).
  207 |       const serverSide = async () => {
  208 |         await expect(downloadLink).toHaveAttribute('href', /download=/);
  209 |         const open = await row.getByRole('link', { name: 'Abrir', exact: true }).getAttribute('href');
  210 |         const opened = await page.context().request.get(open);
  211 |         expect(opened.ok()).toBe(true);
  212 |         expect(Buffer.from(await opened.body()).equals(buffer)).toBe(true);
  213 |         const attachment = await page.context().request.get(await downloadLink.getAttribute('href'));
  214 |         expect(attachment.headers()['content-disposition']).toMatch(new RegExp(`attachment.*${name.replace('.', '\\.')}`));
  215 |         expect(Buffer.from(await attachment.body()).equals(buffer)).toBe(true);
  216 |       };
  217 |       await test.step('open, server-side download and real browser download', async () => {
  218 |         await serverSide();
  219 |         const downloadEvent = page.waitForEvent('download');
  220 |         await downloadLink.click();
  221 |         const download = await downloadEvent;
  222 |         expect(download.suggestedFilename()).toBe(name);
  223 |         expect(await download.failure()).toBeNull();
  224 |         expect(readFileSync(await download.path()).equals(buffer)).toBe(true);
  225 |       });
  226 |       await editor.reloadAndWait();
  227 |       await expect(row).toBeVisible({ timeout: 20_000 });
  228 |       // A second download in the same WebKit page session emits no event, so after the reload persistence is verified
  229 |       // through the same signed URLs the links use.
  230 |       await test.step('after reload: open and download URLs still serve the file', serverSide);
  231 |     });
  232 |   }
  233 | 
  234 |   for (const [tc, label, file] of [
  235 |     ['TC0073', 'an executable', { name: 'script-qa.exe', mimeType: 'application/x-msdownload', buffer: fixtureBytes('attachments/script-qa.exe') }],
  236 |     ['TC0074', 'an HTML file', { name: 'pagina-qa.html', mimeType: 'text/html', buffer: fixtureBytes('attachments/pagina-qa.html') }],
  237 |     ['TC0075', 'a PDF over 5 MB', { name: 'big-qa.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(FIVE_MB + 1, 1) }],
  238 |   ]) {
  239 |     test(`${tc} - ${label} is refused with a message and the page keeps its content`, async ({ createdPage, editor }) => {
  240 |       await editor.start({ saved: ['Previous content QA'], focus: false });
  241 |       const chooser = await editor.openAttachmentChooser();
  242 |       await chooser.setFiles(file);
  243 |       await expect(editor.toasts.filter({ hasText: /Formato no admitido|supera el máximo de 5 MB/ })).toBeVisible();
  244 |       await expect(editor.surface.locator('[data-content-type="wsFile"]')).toHaveCount(0);
  245 |       await expect(editor.block('Previous content QA')).toBeVisible();
  246 |       await editor.expectSaved();
  247 |       await editor.reloadAndWait();
  248 |       expect(await editor.visibleTexts()).toEqual(['Previous content QA']);
  249 |     });
  250 |   }
  251 | });
  252 | 
```