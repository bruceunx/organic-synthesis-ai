

- We currently provide 6 models, namely, reaxys, reaxys_biocatalysis, cas, pistachio, pistachio_ringbreaker and bkms_metabolic. The request format is the same; simply replace the last part of the URL with the desired model name. For instance, the endpoint for the pistachio_ringbreaker model is
  http://0.0.0.0:9410/predictions/pistachio_ringbreaker.

```bash
torchserve --start --foreground --ncs --model-store=mars --models reaxys=reaxys.mar

```
