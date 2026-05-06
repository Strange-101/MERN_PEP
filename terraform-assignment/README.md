# Terraform AWS EC2 Assignment

## Objective

This project demonstrates how to create an AWS EC2 instance using Terraform on AWS.

The assignment covers:
- Terraform initialization
- Infrastructure planning
- Infrastructure deployment
- AWS EC2 provisioning using Infrastructure as Code (IaC)

---

# Technologies Used

- Terraform
- AWS EC2
- AWS CLI
- Amazon Linux AMI

---

# Project Structure

```bash
terraform-assignment/
│
├── main.tf
├── README.md
├── .terraform.lock.hcl
```

---

# Terraform Configuration

The Terraform configuration creates:

- AWS EC2 Instance
- Amazon Linux AMI
- Instance Type: `t2.micro`
- Tag Name: `Terraform-Student-Instance`

---

# Provider Configuration

```hcl
provider "aws" {
  region = "ap-south-1"
}
```

---

# EC2 Resource Configuration

```hcl
resource "aws_instance" "my_instance" {
  ami           = "ami-0f58b397bc5c1f2e8"
  instance_type = "t2.micro"

  tags = {
    Name = "Terraform-Student-Instance"
  }
}
```

---

# Output Configuration

```hcl
output "instance_public_ip" {
  value = aws_instance.my_instance.public_ip
}
```

---

# Commands Used

## Initialize Terraform

```bash
terraform init
```

## Preview Infrastructure Changes

```bash
terraform plan
```

## Create Infrastructure

```bash
terraform apply
```

## Destroy Infrastructure

```bash
terraform destroy
```

---

# Terraform Apply Output

After successful deployment:

```bash
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

Terraform also generated the EC2 public IP address.

---

# Verification

The EC2 instance was verified using:

- AWS EC2 Console
- AWS CLI command:

```bash
aws ec2 describe-instances --region ap-south-1
```

---

# Learning Outcome

Through this assignment, the following concepts were learned:

- Basics of Terraform
- Infrastructure as Code (IaC)
- AWS Provider configuration
- EC2 provisioning using Terraform
- Terraform workflow (`init`, `plan`, `apply`, `destroy`)

---

# Author

Kunal Mahore
