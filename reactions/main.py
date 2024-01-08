import subprocess

# run torchserve
subprocess.run(
    [
        'torchserve',
        '--start',
        '--ncs',
        '--ts-config',
        'config.properties',
    ],
    stdout=subprocess.PIPE,
)
