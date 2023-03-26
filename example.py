import torch

class ToyModelWithLotsOfLayers(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.linear1 = torch.nn.Linear(10, 10)
        self.conv1 = torch.nn.Conv2d(1, 20, 5, 1)
        self.linear2 = torch.nn.Linear(10, 10)
        self.linear3 = torch.nn.Linear(10, 50)

    def forward(self, x):
        x = self.linear1(x)
        x = self.conv1(x)
        x = self.linear2(x)
        x = self.linear3(x)
        return x


x = torch.rand(1, 10)
y = torch.rand(10, 10)

c = x * y
model = ToyModelWithLotsOfLayers()